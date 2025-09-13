import asyncio
import sqlite3
from pathlib import Path

def check_audit_results():
    db_path = Path("xteam_pro.db")
    if not db_path.exists():
        print("Database file not found")
        return
    
    conn = sqlite3.connect("xteam_pro.db")
    cursor = conn.cursor()
    
    # Check audits table
    cursor.execute("SELECT id, status FROM audits ORDER BY id")
    audits = cursor.fetchall()
    print("Audits:")
    for audit in audits:
        print(f"  ID: {audit[0]}, Status: {audit[1]}")
    
    # Check audit_results table
    cursor.execute("SELECT audit_id FROM audit_results ORDER BY audit_id")
    results = cursor.fetchall()
    print("\nAudit Results:")
    for result in results:
        print(f"  Audit ID: {result[0]}")
    
    # Check specific audit 4
    cursor.execute("SELECT * FROM audit_results WHERE audit_id = 4")
    result_4 = cursor.fetchall()
    print(f"\nAudit 4 results count: {len(result_4)}")
    
    conn.close()

if __name__ == "__main__":
    check_audit_results()