import openai
import asyncio
import json
from typing import Dict, List, Any, Optional
from datetime import datetime
import os
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database.config import get_async_db
from models.audit import Audit, AuditResult
from models.admin import AuditConfiguration

class AIService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        # Check if we're in mock mode (development with placeholder key)
        self.mock_mode = api_key == "your-openai-api-key-here" or not api_key
        
        if not self.mock_mode:
            self.client = openai.AsyncOpenAI(api_key=api_key)
        else:
            self.client = None
        self.default_model = "gpt-4"
    
    async def get_active_configuration(self, db: AsyncSession) -> Optional[AuditConfiguration]:
        """
        Get active audit configuration
        """
        query = select(AuditConfiguration).where(AuditConfiguration.is_active == True)
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    async def process_audit_async(self, audit_id: str, audit_data: Dict[str, Any]):
        """
        Process audit asynchronously with AI analysis
        """
        try:
            # Run in background task
            asyncio.create_task(self._process_audit_background(audit_id, audit_data))
        except Exception as e:
            print(f"Error starting audit processing: {str(e)}")
    
    async def _process_audit_background(self, audit_id: str, audit_data: Dict[str, Any]):
        """
        Background task for processing audit
        """
        async for db in get_async_db():
            try:
                # Get audit configuration
                config = await self.get_active_configuration(db)
                model = config.ai_model if config else self.default_model
                
                # Update audit status
                audit = await db.get(Audit, audit_id)
                if audit:
                    audit.status = "processing"
                    await db.commit()
                
                # Perform AI analysis
                analysis_result = await self._analyze_business_processes(
                    audit_data, model, config
                )
                
                # Save results to database
                audit_result = AuditResult(
                    audit_id=audit_id,
                    maturity_score=analysis_result["maturity_score"],
                    automation_potential=min(100, int(analysis_result["roi_projection"] / 2)),  # Convert ROI to potential score
                    roi_projection=analysis_result["roi_projection"],
                    implementation_timeline=analysis_result.get("timeline_estimate", "6-12 months"),
                    strengths=["Current process documentation", "Team readiness"],
                    weaknesses=["Manual processes", "Limited automation"],
                    opportunities=analysis_result["automation_opportunities"],
                    recommendations=analysis_result["recommendations"],
                    process_scores={"data_entry": 60, "reporting": 70, "communication": 50},
                    priority_areas=analysis_result["automation_opportunities"][:3],  # Top 3 opportunities
                    estimated_savings=analysis_result.get("cost_analysis", {}).get("annual_savings", 100000.0),
                    implementation_cost=analysis_result.get("cost_analysis", {}).get("estimated_investment", 75000.0),
                    payback_period=analysis_result.get("cost_analysis", {}).get("payback_period_months", 12)
                )
                
                db.add(audit_result)
                
                # Update audit status
                if audit:
                    audit.status = "completed"
                
                await db.commit()
                
                # Generate PDF report if configured
                if config and config.auto_generate_pdf:
                    from services.pdf_service import PDFService
                    pdf_service = PDFService()
                    await pdf_service.generate_audit_report(audit_id, analysis_result)
                
            except Exception as e:
                print(f"Error processing audit {audit_id}: {str(e)}")
                # Update audit status to failed
                try:
                    audit = await db.get(Audit, audit_id)
                    if audit:
                        audit.status = "failed"
                        await db.commit()
                except:
                    pass
            finally:
                await db.close()
    
    async def _analyze_business_processes(
        self, 
        audit_data: Dict[str, Any], 
        model: str = "gpt-4",
        config: Optional[AuditConfiguration] = None
    ) -> Dict[str, Any]:
        """
        Analyze business processes using OpenAI or mock data
        """
        try:
            # Return mock data if in mock mode
            if self.mock_mode:
                return self._get_default_analysis(audit_data)
            
            # Prepare analysis prompt
            system_prompt = self._get_system_prompt(config)
            user_prompt = self._build_analysis_prompt(audit_data)
            
            # Call OpenAI API
            response = await self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,
                max_tokens=4000
            )
            
            # Parse response
            analysis_text = response.choices[0].message.content
            analysis_result = self._parse_analysis_response(analysis_text)
            
            return analysis_result
            
        except Exception as e:
            print(f"Error in AI analysis: {str(e)}")
            # Return default analysis if AI fails
            return self._get_default_analysis(audit_data)
    
    def _get_system_prompt(self, config: Optional[AuditConfiguration] = None) -> str:
        """
        Get system prompt for AI analysis
        """
        base_prompt = """
You are an expert business process automation consultant with deep expertise in:
- Business process analysis and optimization
- Digital transformation strategies
- ROI calculation and financial modeling
- Risk assessment and mitigation
- Implementation roadmap planning
- Technology selection and integration

Your task is to analyze the provided business information and generate a comprehensive automation assessment.

Provide your analysis in the following JSON format:
{
    "maturity_score": <integer 0-100>,
    "roi_projection": <float representing percentage>,
    "recommendations": [<list of specific recommendations>],
    "automation_opportunities": [<list of automation opportunities>],
    "timeline_estimate": "<string like '6-12 months'>",
    "cost_analysis": {
        "estimated_investment": <float>,
        "annual_savings": <float>,
        "payback_period_months": <integer>
    }
}

Be specific, actionable, and data-driven in your recommendations.
"""
        
        if config and config.custom_prompts:
            # Add custom prompts if configured
            custom_additions = config.custom_prompts.get("system_additions", "")
            if custom_additions:
                base_prompt += f"\n\nAdditional Instructions:\n{custom_additions}"
        
        return base_prompt
    
    def _build_analysis_prompt(self, audit_data: Dict[str, Any]) -> str:
        """
        Build user prompt with audit data
        """
        prompt = f"""
Please analyze the following business for automation opportunities:

**Company Information:**
- Company: {audit_data.get('company_name', 'N/A')}
- Industry: {audit_data.get('industry', 'N/A')}
- Size: {audit_data.get('company_size', 'N/A')}

**Current State:**
- Current Processes: {audit_data.get('current_processes', 'N/A')}
- Pain Points: {audit_data.get('pain_points', 'N/A')}

**Goals and Requirements:**
- Automation Goals: {audit_data.get('automation_goals', 'N/A')}
- Budget Range: {audit_data.get('budget_range', 'N/A')}
- Timeline: {audit_data.get('timeline', 'N/A')}

**Contact Information:**
- Contact: {audit_data.get('contact_name', 'N/A')} ({audit_data.get('contact_email', 'N/A')})

Based on this information, provide a comprehensive automation assessment following the specified JSON format.
"""
        
        return prompt
    
    def _parse_analysis_response(self, response_text: str) -> Dict[str, Any]:
        """
        Parse AI response and extract structured data
        """
        try:
            # Try to extract JSON from response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx != -1:
                json_str = response_text[start_idx:end_idx]
                parsed_data = json.loads(json_str)
                
                # Validate and clean data
                return self._validate_analysis_data(parsed_data)
            else:
                # Fallback parsing if JSON not found
                return self._fallback_parse(response_text)
                
        except json.JSONDecodeError:
            # Fallback parsing
            return self._fallback_parse(response_text)
    
    def _validate_analysis_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate and clean analysis data
        """
        cost_analysis = data.get("cost_analysis", {
            "estimated_investment": 100000.0,
            "annual_savings": 150000.0,
            "payback_period_months": 8
        })
        
        validated_data = {
            "maturity_score": max(0, min(100, int(data.get("maturity_score", 50)))),
            "automation_potential": max(0, min(100, int(data.get("automation_potential", 75)))),
            "roi_projection": float(data.get("roi_projection", 150.0)),
            "implementation_timeline": data.get("timeline_estimate", "6-12 months"),
            "strengths": data.get("strengths", ["Well-defined processes", "Clear goals"]),
            "weaknesses": data.get("weaknesses", ["Manual processes", "Limited integration"]),
            "opportunities": data.get("automation_opportunities", ["Data entry automation", "Report generation"]),
            "recommendations": data.get("recommendations", ["Implement process automation", "Digitize manual workflows"]),
            "process_scores": data.get("process_scores", {"data_entry": 60, "reporting": 70, "approval_workflow": 50}),
            "priority_areas": data.get("priority_areas", ["Data entry", "Report generation", "Workflow automation"]),
            "estimated_savings": float(cost_analysis.get("annual_savings", 150000.0)),
            "implementation_cost": float(cost_analysis.get("estimated_investment", 100000.0)),
            "payback_period": float(cost_analysis.get("payback_period_months", 8))
        }
        
        return validated_data
    
    def _get_mock_analysis(self, audit_data: dict) -> dict:
        """Provide mock analysis data for development/testing"""
        return {
            "maturity_score": 65,
            "automation_potential": "High - Multiple processes identified for automation",
            "roi_projection": "25-35% cost reduction within 18 months",
            "implementation_timeline": "8-14 months for full implementation",
            "strengths": [
                "Well-defined business processes",
                "Clear automation goals",
                "Adequate budget allocation"
            ],
            "weaknesses": [
                "Manual data entry processes",
                "Lack of integration between systems",
                "Time-consuming approval workflows"
            ],
            "opportunities": [
                "Document management automation",
                "Customer service chatbots",
                "Automated reporting and analytics",
                "Workflow optimization"
            ],
            "recommendations": [
                "Start with high-impact, low-complexity automations",
                "Implement RPA for repetitive tasks",
                "Consider AI-powered customer service solutions",
                "Establish automation governance framework"
            ],
            "process_scores": {
                "data_management": 70,
                "customer_service": 60,
                "financial_processes": 75,
                "hr_processes": 55,
                "operations": 65
            },
            "priority_areas": [
                "Customer service automation",
                "Data entry and processing",
                "Report generation"
            ],
            "estimated_savings": "$50,000 - $150,000 annually",
            "implementation_cost": "$75,000 - $125,000",
            "payback_period": "12-18 months"
        }
    
    def _fallback_parse(self, response_text: str) -> Dict[str, Any]:
        """
        Fallback parsing when JSON extraction fails
        """
        return self._get_mock_analysis({})
    
    def _get_fallback_analysis(self, audit_data: dict) -> dict:
        """Provide fallback analysis when AI fails"""
        return self._get_mock_analysis(audit_data)
    
    def _get_default_analysis(self, audit_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get default analysis when AI fails
        """
        # Calculate basic metrics based on company size
        size_multipliers = {
            "startup": 0.8,
            "small": 1.0,
            "medium": 1.2,
            "large": 1.5,
            "enterprise": 2.0
        }
        
        multiplier = size_multipliers.get(audit_data.get("company_size", "medium"), 1.0)
        
        return {
            "maturity_score": 55,
            "automation_potential": 75,
            "roi_projection": 150.0 * multiplier,
            "implementation_timeline": "6-12 months depending on scope and complexity",
            "strengths": [
                "Well-defined business processes",
                "Clear automation goals",
                "Adequate budget allocation"
            ],
            "weaknesses": [
                "Manual data entry processes",
                "Lack of integration between systems",
                "Time-consuming approval workflows"
            ],
            "opportunities": [
                "Document management automation",
                "Customer service chatbots",
                "Automated reporting and analytics",
                "Workflow optimization"
            ],
            "recommendations": [
                "Conduct detailed process mapping",
                "Implement workflow automation tools",
                "Establish data integration strategy",
                "Develop change management plan"
            ],
            "process_scores": {
                "data_management": 70,
                "customer_service": 60,
                "financial_processes": 75,
                "hr_processes": 55,
                "operations": 65
            },
            "priority_areas": [
                "Customer service automation",
                "Data entry and processing",
                "Report generation"
            ],
            "estimated_savings": 50000.0 * multiplier,
            "implementation_cost": 75000.0 * multiplier,
            "payback_period": 12.0
        }
    
    async def generate_roi_insights(self, roi_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate AI-powered ROI insights
        """
        try:
            prompt = f"""
Analyze the following ROI calculation data and provide strategic insights:

Company Size: {roi_data.get('company_size')}
Industry: {roi_data.get('industry')}
Annual Revenue: ${roi_data.get('annual_revenue'):,.0f}
Processes to Automate: {', '.join(roi_data.get('processes_to_automate', []))}
Expected Efficiency Gain: {roi_data.get('expected_efficiency_gain')}%
Budget Range: {roi_data.get('budget_range')}

Provide:
1. Strategic recommendations (3-5 specific actions)
2. Implementation roadmap (4-6 phases with timelines)
3. Risk mitigation strategies (3-4 key risks and solutions)

Format as JSON:
{
    "recommendations": ["recommendation 1", "recommendation 2", ...],
    "roadmap": [{"phase": "Phase name", "duration": "X months", "description": "What happens"}],
    "risk_mitigation": ["risk mitigation 1", "risk mitigation 2", ...]
}
"""
            
            response = await self.client.chat.completions.create(
                model=self.default_model,
                messages=[
                    {"role": "system", "content": "You are an expert ROI analyst and automation consultant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=2000
            )
            
            response_text = response.choices[0].message.content
            
            # Try to parse JSON response
            try:
                start_idx = response_text.find('{')
                end_idx = response_text.rfind('}') + 1
                if start_idx != -1 and end_idx != -1:
                    json_str = response_text[start_idx:end_idx]
                    return json.loads(json_str)
            except:
                pass
            
            # Fallback response
            return {
                "recommendations": [
                    "Start with high-impact, low-complexity processes",
                    "Establish clear success metrics and KPIs",
                    "Invest in employee training and change management",
                    "Implement in phases to minimize disruption"
                ],
                "roadmap": [
                    {"phase": "Assessment", "duration": "1-2 months", "description": "Process mapping and tool evaluation"},
                    {"phase": "Pilot", "duration": "2-3 months", "description": "Small-scale implementation and testing"},
                    {"phase": "Rollout", "duration": "3-6 months", "description": "Full implementation across organization"},
                    {"phase": "Optimization", "duration": "Ongoing", "description": "Continuous improvement and scaling"}
                ],
                "risk_mitigation": [
                    "Conduct thorough stakeholder analysis and buy-in sessions",
                    "Implement robust data backup and recovery procedures",
                    "Establish clear governance and approval processes",
                    "Plan for adequate training and support resources"
                ]
            }
            
        except Exception as e:
            print(f"Error generating ROI insights: {str(e)}")
            # Return default insights
            return {
                "recommendations": [
                    "Focus on processes with highest manual effort",
                    "Ensure strong executive sponsorship",
                    "Plan for comprehensive user training"
                ],
                "roadmap": [
                    {"phase": "Planning", "duration": "2 months", "description": "Strategy and design"},
                    {"phase": "Implementation", "duration": "6 months", "description": "Development and deployment"}
                ],
                "risk_mitigation": [
                    "Establish clear project governance",
                    "Plan for change management",
                    "Ensure adequate technical support"
                ]
            }