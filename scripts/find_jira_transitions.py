#!/usr/bin/env python3
"""
Jira Transition ID Detector
Finds the correct transition IDs for your Jira instance to use in automation
"""

import requests
import json
import sys
from typing import Optional

def get_transitions(domain: str, email: str, token: str, ticket_key: str) -> Optional[dict]:
    """Get available transitions for a ticket."""
    url = f"https://{domain}.atlassian.net/rest/api/3/issue/{ticket_key}/transitions"
    auth = (email, token)
    headers = {"Accept": "application/json"}
    
    try:
        resp = requests.get(url, auth=auth, headers=headers)
        if resp.status_code == 200:
            return resp.json()
        else:
            print(f"✗ Failed to fetch transitions: {resp.status_code}")
            print(f"  Response: {resp.text[:200]}")
            return None
    except Exception as e:
        print(f"✗ Error: {e}")
        return None

def display_transitions(transitions_data: dict):
    """Display available transitions in a readable format."""
    transitions = transitions_data.get("transitions", [])
    
    if not transitions:
        print("✗ No transitions available")
        return
    
    print("\n" + "="*60)
    print("AVAILABLE TRANSITIONS")
    print("="*60)
    
    for t in transitions:
        status_name = t.get("to", {}).get("name", "Unknown")
        transition_id = t.get("id", "N/A")
        print(f"\n→ {status_name}")
        print(f"  ID: {transition_id}")
        print(f"  Name: {t.get('name', 'N/A')}")
    
    print("\n" + "="*60)
    print("UPDATE YOUR WORKFLOW")
    print("="*60)
    print("\nIn .github/workflows/jira-ticket-status-transitions-ci-cd.yml, update the transition IDs:")
    print("\nExample:")
    for t in transitions:
        status_name = t.get("to", {}).get("name", "").replace(" ", "")
        transition_id = t.get("id", "?")
        print(f'  -d \'{{"transition":{{"id":"{transition_id}"}}}}\'  # → {status_name}')

def main():
    print("\n" + "="*60)
    print("JIRA TRANSITION ID DETECTOR")
    print("="*60)
    
    # Get inputs
    domain = input("\nJira domain (e.g., designercompk): ").strip()
    email = input("Atlassian email (e.g., your@email.com): ").strip()
    token = input("Jira API token: ").strip()
    ticket_key = input("Ticket key to check (e.g., KAN-43): ").strip().upper()
    
    if not all([domain, email, token, ticket_key]):
        print("✗ Missing required inputs")
        sys.exit(1)
    
    print(f"\nConnecting to {domain}.atlassian.net...")
    print(f"Fetching transitions for {ticket_key}...\n")
    
    transitions = get_transitions(domain, email, token, ticket_key)
    
    if transitions:
        display_transitions(transitions)
        
        print("\n💡 TIP: Copy the transition IDs and update your workflow file:")
        print("   .github/workflows/jira-ticket-status-transitions-ci-cd.yml")
        print("\n✓ Done!")
    else:
        print("✗ Could not fetch transitions")
        sys.exit(1)

if __name__ == "__main__":
    main()
