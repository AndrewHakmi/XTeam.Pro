from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from datetime import datetime
import math

from services.ai_service import AIService

router = APIRouter(tags=["calculator"])

# Pydantic models for request/response
class ROICalculationRequest(BaseModel):
    # Company Information
    company_size: str = Field(..., description="Company size: startup, small, medium, large, enterprise")
    industry: str = Field(..., min_length=1, max_length=100)
    annual_revenue: float = Field(..., gt=0, description="Annual revenue in USD")
    
    # Current State
    current_processes: List[str] = Field(..., min_items=1, description="List of current manual processes")
    employee_count: int = Field(..., gt=0, description="Number of employees")
    automation_readiness: int = Field(..., ge=1, le=10, description="Automation readiness score 1-10")
    
    # Automation Goals
    processes_to_automate: List[str] = Field(..., min_items=1, description="Processes to be automated")
    expected_efficiency_gain: float = Field(..., ge=0, le=100, description="Expected efficiency gain percentage")
    implementation_timeline: int = Field(..., gt=0, le=36, description="Implementation timeline in months")
    
    # Investment Parameters
    budget_range: str = Field(..., description="Budget range: 10k-50k, 50k-100k, 100k-500k, 500k+")
    maintenance_budget_percentage: float = Field(15.0, ge=0, le=50, description="Annual maintenance as % of initial investment")
    
    # Risk Factors
    change_management_readiness: int = Field(..., ge=1, le=10, description="Change management readiness 1-10")
    technical_complexity: int = Field(..., ge=1, le=10, description="Technical complexity 1-10")
    regulatory_requirements: bool = Field(False, description="Has regulatory requirements")

class ROICalculationResponse(BaseModel):
    # Financial Metrics
    initial_investment: float
    annual_savings: float
    roi_percentage: float
    payback_period_months: float
    npv_3_years: float
    irr_percentage: float
    
    # Detailed Breakdown
    cost_breakdown: Dict[str, float]
    savings_breakdown: Dict[str, float]
    risk_factors: Dict[str, float]
    
    # Projections
    yearly_projections: List[Dict[str, float]]
    
    # AI Insights
    ai_recommendations: List[str]
    implementation_roadmap: List[Dict[str, str]]
    risk_mitigation_strategies: List[str]
    
    # Metadata
    calculation_date: datetime
    confidence_score: float
    assumptions: List[str]

class ProcessAutomationRequest(BaseModel):
    process_name: str = Field(..., min_length=1, max_length=200)
    current_time_hours_per_week: float = Field(..., gt=0)
    current_error_rate_percentage: float = Field(..., ge=0, le=100)
    employee_hourly_cost: float = Field(..., gt=0)
    process_complexity: int = Field(..., ge=1, le=10)
    automation_potential: int = Field(..., ge=1, le=10)

class ProcessAutomationResponse(BaseModel):
    process_name: str
    automation_feasibility: float
    estimated_time_savings_percentage: float
    estimated_cost_savings_annual: float
    implementation_effort: str
    recommended_tools: List[str]
    implementation_steps: List[str]

@router.post("/roi", response_model=ROICalculationResponse)
async def calculate_roi(roi_request: ROICalculationRequest):
    """
    Calculate ROI for automation investment with AI-powered insights
    """
    try:
        # Initialize AI service for enhanced calculations
        ai_service = AIService()
        
        # Calculate base investment based on company size and complexity
        base_investments = {
            "startup": {"10k-50k": 25000, "50k-100k": 75000, "100k-500k": 200000, "500k+": 300000},
            "small": {"10k-50k": 35000, "50k-100k": 85000, "100k-500k": 250000, "500k+": 400000},
            "medium": {"10k-50k": 45000, "50k-100k": 95000, "100k-500k": 300000, "500k+": 500000},
            "large": {"10k-50k": 50000, "50k-100k": 100000, "100k-500k": 350000, "500k+": 600000},
            "enterprise": {"10k-50k": 50000, "50k-100k": 100000, "100k-500k": 400000, "500k+": 800000}
        }
        
        initial_investment = base_investments.get(roi_request.company_size, {}).get(
            roi_request.budget_range, 100000
        )
        
        # Adjust investment based on technical complexity
        complexity_multiplier = 1 + (roi_request.technical_complexity - 5) * 0.1
        initial_investment *= complexity_multiplier
        
        # Calculate annual savings
        avg_employee_cost = 75000  # Average annual employee cost
        efficiency_factor = roi_request.expected_efficiency_gain / 100
        
        # Process-based savings calculation
        process_savings = len(roi_request.processes_to_automate) * avg_employee_cost * efficiency_factor * 0.3
        
        # Error reduction savings
        error_reduction_savings = roi_request.annual_revenue * 0.02 * efficiency_factor
        
        # Time savings
        time_savings = roi_request.employee_count * avg_employee_cost * efficiency_factor * 0.15
        
        annual_savings = process_savings + error_reduction_savings + time_savings
        
        # Apply readiness factors
        readiness_factor = (roi_request.automation_readiness + roi_request.change_management_readiness) / 20
        annual_savings *= readiness_factor
        
        # Calculate financial metrics
        annual_maintenance = initial_investment * (roi_request.maintenance_budget_percentage / 100)
        net_annual_savings = annual_savings - annual_maintenance
        
        roi_percentage = (net_annual_savings / initial_investment) * 100 if initial_investment > 0 else 0
        payback_period_months = (initial_investment / net_annual_savings) * 12 if net_annual_savings > 0 else float('inf')
        
        # NPV calculation (3 years, 10% discount rate)
        discount_rate = 0.10
        npv_3_years = -initial_investment
        for year in range(1, 4):
            npv_3_years += net_annual_savings / ((1 + discount_rate) ** year)
        
        # IRR calculation (simplified)
        irr_percentage = ((net_annual_savings / initial_investment) - 1) * 100
        
        # Cost breakdown
        cost_breakdown = {
            "software_licenses": initial_investment * 0.4,
            "implementation_services": initial_investment * 0.3,
            "training_and_change_management": initial_investment * 0.15,
            "infrastructure_and_integration": initial_investment * 0.15
        }
        
        # Savings breakdown
        savings_breakdown = {
            "process_efficiency_savings": process_savings,
            "error_reduction_savings": error_reduction_savings,
            "time_savings": time_savings,
            "maintenance_costs": -annual_maintenance
        }
        
        # Risk factors
        risk_factors = {
            "implementation_risk": roi_request.technical_complexity / 10,
            "adoption_risk": (10 - roi_request.change_management_readiness) / 10,
            "regulatory_risk": 0.3 if roi_request.regulatory_requirements else 0.1,
            "technology_obsolescence_risk": 0.2
        }
        
        # Yearly projections
        yearly_projections = []
        for year in range(1, 4):
            growth_factor = 1 + (0.05 * year)  # 5% annual growth
            yearly_projections.append({
                "year": year,
                "savings": annual_savings * growth_factor,
                "costs": annual_maintenance * growth_factor,
                "net_benefit": (annual_savings - annual_maintenance) * growth_factor,
                "cumulative_roi": ((annual_savings - annual_maintenance) * growth_factor * year - initial_investment) / initial_investment * 100
            })
        
        # Get AI-powered insights
        ai_insights = await ai_service.generate_roi_insights(roi_request.dict())
        
        # Calculate confidence score
        confidence_factors = [
            roi_request.automation_readiness / 10,
            roi_request.change_management_readiness / 10,
            1 - (roi_request.technical_complexity / 10),
            readiness_factor
        ]
        confidence_score = sum(confidence_factors) / len(confidence_factors)
        
        # Generate assumptions
        assumptions = [
            f"Average employee cost: ${avg_employee_cost:,.0f} annually",
            f"Efficiency gain: {roi_request.expected_efficiency_gain}%",
            f"Implementation timeline: {roi_request.implementation_timeline} months",
            f"Annual maintenance: {roi_request.maintenance_budget_percentage}% of initial investment",
            "Discount rate: 10% for NPV calculation",
            "Annual savings growth: 5% year-over-year"
        ]
        
        return ROICalculationResponse(
            initial_investment=round(initial_investment, 2),
            annual_savings=round(annual_savings, 2),
            roi_percentage=round(roi_percentage, 2),
            payback_period_months=round(payback_period_months, 2) if payback_period_months != float('inf') else 999,
            npv_3_years=round(npv_3_years, 2),
            irr_percentage=round(irr_percentage, 2),
            cost_breakdown={k: round(v, 2) for k, v in cost_breakdown.items()},
            savings_breakdown={k: round(v, 2) for k, v in savings_breakdown.items()},
            risk_factors={k: round(v, 3) for k, v in risk_factors.items()},
            yearly_projections=[
                {k: round(v, 2) if isinstance(v, float) else v for k, v in proj.items()}
                for proj in yearly_projections
            ],
            ai_recommendations=ai_insights.get("recommendations", []),
            implementation_roadmap=ai_insights.get("roadmap", []),
            risk_mitigation_strategies=ai_insights.get("risk_mitigation", []),
            calculation_date=datetime.utcnow(),
            confidence_score=round(confidence_score, 3),
            assumptions=assumptions
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to calculate ROI: {str(e)}"
        )

@router.post("/process-analysis", response_model=ProcessAutomationResponse)
async def analyze_process_automation(
    process_request: ProcessAutomationRequest
):
    """
    Analyze individual process for automation potential
    """
    try:
        # Calculate automation feasibility
        complexity_factor = (11 - process_request.process_complexity) / 10
        potential_factor = process_request.automation_potential / 10
        automation_feasibility = (complexity_factor + potential_factor) / 2
        
        # Estimate time savings
        base_time_savings = min(automation_feasibility * 80, 95)  # Max 95% savings
        estimated_time_savings_percentage = base_time_savings
        
        # Calculate cost savings
        weekly_cost = process_request.current_time_hours_per_week * process_request.employee_hourly_cost
        annual_cost = weekly_cost * 52
        
        # Factor in error reduction
        error_cost_reduction = annual_cost * (process_request.current_error_rate_percentage / 100) * 0.5
        
        time_cost_savings = annual_cost * (estimated_time_savings_percentage / 100)
        estimated_cost_savings_annual = time_cost_savings + error_cost_reduction
        
        # Determine implementation effort
        effort_score = (process_request.process_complexity + (11 - process_request.automation_potential)) / 2
        if effort_score <= 3:
            implementation_effort = "Low"
        elif effort_score <= 6:
            implementation_effort = "Medium"
        else:
            implementation_effort = "High"
        
        # Recommend tools based on process characteristics
        recommended_tools = []
        if automation_feasibility > 0.7:
            recommended_tools.extend(["RPA (Robotic Process Automation)", "Workflow Automation"])
        if process_request.current_error_rate_percentage > 5:
            recommended_tools.append("Data Validation Tools")
        if process_request.process_complexity <= 5:
            recommended_tools.append("No-Code/Low-Code Platforms")
        else:
            recommended_tools.append("Custom Development")
        
        # Generate implementation steps
        implementation_steps = [
            "Process mapping and documentation",
            "Stakeholder alignment and requirements gathering",
            "Tool selection and procurement",
            "Development and configuration",
            "Testing and validation",
            "User training and change management",
            "Deployment and monitoring",
            "Optimization and continuous improvement"
        ]
        
        return ProcessAutomationResponse(
            process_name=process_request.process_name,
            automation_feasibility=round(automation_feasibility, 3),
            estimated_time_savings_percentage=round(estimated_time_savings_percentage, 2),
            estimated_cost_savings_annual=round(estimated_cost_savings_annual, 2),
            implementation_effort=implementation_effort,
            recommended_tools=recommended_tools,
            implementation_steps=implementation_steps
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze process automation: {str(e)}"
        )

@router.get("/benchmarks/{industry}")
async def get_industry_benchmarks(industry: str):
    """
    Get automation benchmarks for specific industry
    """
    try:
        # Industry-specific benchmarks (simplified)
        benchmarks = {
            "manufacturing": {
                "average_automation_level": 65,
                "typical_roi_range": "150-300%",
                "average_payback_months": 18,
                "common_processes": ["Quality Control", "Inventory Management", "Production Planning"]
            },
            "finance": {
                "average_automation_level": 45,
                "typical_roi_range": "200-400%",
                "average_payback_months": 12,
                "common_processes": ["Invoice Processing", "Compliance Reporting", "Customer Onboarding"]
            },
            "healthcare": {
                "average_automation_level": 35,
                "typical_roi_range": "100-250%",
                "average_payback_months": 24,
                "common_processes": ["Patient Registration", "Claims Processing", "Appointment Scheduling"]
            },
            "retail": {
                "average_automation_level": 55,
                "typical_roi_range": "180-350%",
                "average_payback_months": 15,
                "common_processes": ["Inventory Management", "Order Processing", "Customer Service"]
            }
        }
        
        industry_data = benchmarks.get(industry.lower(), {
            "average_automation_level": 50,
            "typical_roi_range": "150-300%",
            "average_payback_months": 18,
            "common_processes": ["Data Entry", "Report Generation", "Communication"]
        })
        
        return {
            "industry": industry,
            "benchmarks": industry_data,
            "last_updated": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get industry benchmarks: {str(e)}"
        )