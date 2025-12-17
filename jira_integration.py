#!/usr/bin/env python3
"""
Jira Integration Script - Populate Epics, Features, and Tasks
Designed for designercompk.atlassian.net (KAN project)
"""

import argparse
import requests
import json
from typing import Optional, Dict, List

class JiraIntegration:
    def __init__(self, domain: str, email: str, token: str, project_key: str):
        self.domain = domain
        self.email = email
        self.token = token
        self.project_key = project_key
        self.base_url = f"https://{domain}.atlassian.net/rest/api/3"
        self.auth = (email, token)
        self.headers = {"Accept": "application/json", "Content-Type": "application/json"}
        
    def get_project_id(self) -> Optional[str]:
        """Get the project ID for the given project key."""
        url = f"{self.base_url}/project/{self.project_key}"
        try:
            resp = requests.get(url, auth=self.auth, headers=self.headers)
            if resp.status_code == 200:
                return resp.json()["id"]
        except Exception as e:
            print(f"Error fetching project: {e}")
        return None

    def create_epic(self, name: str, description: str) -> Optional[str]:
        """Create an Epic and return its issue key."""
        payload = {
            "fields": {
                "project": {"key": self.project_key},
                "issuetype": {"name": "Epic"},
                "summary": name,
                "description": {
                    "version": 1,
                    "type": "doc",
                    "content": [
                        {
                            "type": "paragraph",
                            "content": [
                                {"type": "text", "text": description}
                            ]
                        }
                    ]
                }
            }
        }
        url = f"{self.base_url}/issue"
        try:
            resp = requests.post(url, auth=self.auth, headers=self.headers, json=payload)
            if resp.status_code in [200, 201]:
                issue_key = resp.json()["key"]
                print(f"✓ Epic created: {issue_key} - {name}")
                return issue_key
            else:
                print(f"✗ Failed to create epic {name}: {resp.status_code} - {resp.text}")
        except Exception as e:
            print(f"Error creating epic: {e}")
        return None

    def create_story(self, epic_key: str, name: str, description: str) -> Optional[str]:
        """Create a Story/Feature linked to an Epic."""
        payload = {
            "fields": {
                "project": {"key": self.project_key},
                "issuetype": {"name": "Story"},
                "summary": name,
                "description": {
                    "version": 1,
                    "type": "doc",
                    "content": [
                        {
                            "type": "paragraph",
                            "content": [
                                {"type": "text", "text": description}
                            ]
                        }
                    ]
                },
                "customfield_10014": epic_key  # Epic Link field
            }
        }
        url = f"{self.base_url}/issue"
        try:
            resp = requests.post(url, auth=self.auth, headers=self.headers, json=payload)
            if resp.status_code in [200, 201]:
                issue_key = resp.json()["key"]
                print(f"  ✓ Story created: {issue_key} - {name}")
                return issue_key
            else:
                print(f"  ✗ Failed to create story {name}: {resp.status_code}")
                print(f"    Response: {resp.text[:200]}")
                # Try again without Epic Link field (fallback)
                print(f"  → Attempting fallback creation without Epic Link...")
                fallback_payload = {
                    "fields": {
                        "project": {"key": self.project_key},
                        "issuetype": {"name": "Story"},
                        "summary": name,
                        "description": {
                            "version": 1,
                            "type": "doc",
                            "content": [
                                {
                                    "type": "paragraph",
                                    "content": [
                                        {"type": "text", "text": description}
                                    ]
                                }
                            ]
                        }
                    }
                }
                resp2 = requests.post(url, auth=self.auth, headers=self.headers, json=fallback_payload)
                if resp2.status_code in [200, 201]:
                    issue_key = resp2.json()["key"]
                    print(f"  ✓ Story created (fallback): {issue_key} - {name}")
                    # Now link it to the Epic
                    self.link_to_epic(issue_key, epic_key)
                    return issue_key
                else:
                    print(f"  ✗ Fallback also failed: {resp2.status_code}")
        except Exception as e:
            print(f"Error creating story: {e}")
        return None

    def link_to_epic(self, story_key: str, epic_key: str) -> bool:
        """Link a Story to an Epic."""
        url = f"{self.base_url}/issue/{story_key}"
        payload = {
            "fields": {
                "customfield_10014": epic_key
            }
        }
        try:
            resp = requests.put(url, auth=self.auth, headers=self.headers, json=payload)
            if resp.status_code in [200, 204]:
                print(f"  ✓ Linked {story_key} to Epic {epic_key}")
                return True
            else:
                print(f"  ⚠ Failed to link {story_key} to Epic: {resp.status_code}")
        except Exception as e:
            print(f"Error linking to epic: {e}")
        return False

    def create_task(self, parent_key: str, name: str, description: str, status: str = "To Do") -> Optional[str]:
        """Create a Task linked to a Story."""
        payload = {
            "fields": {
                "project": {"key": self.project_key},
                "issuetype": {"name": "Task"},
                "summary": name,
                "description": {
                    "version": 1,
                    "type": "doc",
                    "content": [
                        {
                            "type": "paragraph",
                            "content": [
                                {"type": "text", "text": description}
                            ]
                        }
                    ]
                },
                "customfield_10014": parent_key,  # Epic Link (or parent)
                "parent": {"key": parent_key}  # Subtask parent
            }
        }
        url = f"{self.base_url}/issue"
        try:
            resp = requests.post(url, auth=self.auth, headers=self.headers, json=payload)
            if resp.status_code in [200, 201]:
                issue_key = resp.json()["key"]
                print(f"    ✓ Task created: {issue_key} - {name}")
                return issue_key
            else:
                print(f"    ✗ Failed to create task {name}: {resp.status_code}")
        except Exception as e:
            print(f"Error creating task: {e}")
        return None

    def list_epics(self):
        """List all Epics in the configured project."""
        jql = f'project = {self.project_key} AND issuetype = Epic ORDER BY created DESC'
        url = f"{self.base_url}/search/jql"
        payload = {"jql": jql, "fields": ["summary", "status", "assignee"], "maxResults": 100}
        try:
            resp = requests.post(url, auth=self.auth, headers=self.headers, json=payload)
            if resp.status_code == 200:
                issues = resp.json().get("issues", [])
                if not issues:
                    print("No Epics found in project.")
                    return
                print(f"Found {len(issues)} Epics in project {self.project_key}:")
                for i in issues:
                    key = i.get("key")
                    fields = i.get("fields", {})
                    summary = fields.get("summary")
                    status = fields.get("status", {}).get("name")
                    assignee = fields.get("assignee")
                    assignee_str = assignee.get("displayName") if assignee else "Unassigned"
                    print(f"- {key}: {summary} — {status} — {assignee_str}")
            else:
                print(f"Failed to query Epics: {resp.status_code} - {resp.text}")
        except Exception as e:
            print(f"Error listing epics: {e}")

    def assign_and_transition_phase1(self, assignee_email: str):
        """Assign Phase 1 tasks to a user and transition statuses based on known keywords."""
        print(f"\nAssigning Phase 1 tasks to {assignee_email} and updating statuses...")

        mapping = [
            ("Done", [
                "Docker Compose Setup",
                "PostgreSQL Configuration",
                "MongoDB Setup",
                "Redis Setup",
                "Kafka & Zookeeper",
                "Prometheus & Grafana",
                "Nginx Reverse Proxy",
                "PostgreSQL Schema Design",
                "MongoDB Collections Setup",
            ]),
            ("In Progress", [
                "Java Maven CI Workflow",
                "Frontend Next.js CI Workflow",
                "GHCR Publish Workflow",
                "Push Repository to GitHub",
                "Database Migration Scripts",
            ]),
            ("To Do", [
                "User Management API",
                "Product Catalog API",
                "Order Management API",
                "API Documentation (Swagger)",
                "Home Page",
                "Product Listing Page",
                "Product Detail Page",
                "Checkout Page",
            ])
        ]

        for target_status, keywords in mapping:
            for kw in keywords:
                jql = f'project = {self.project_key} AND summary ~ "{kw}"'
                url = f"{self.base_url}/search/jql"
                payload = {"jql": jql, "fields": ["summary"], "maxResults": 50}
                try:
                    resp = requests.post(url, auth=self.auth, headers=self.headers, json=payload)
                    if resp.status_code == 200:
                        issues = resp.json().get("issues", [])
                        if not issues:
                            print(f"  No matching issues found for keyword: '{kw}'")
                        for issue in issues:
                            key = issue.get("key")
                            summary = issue.get("fields", {}).get("summary")
                            print(f"Processing {key}: {summary} -> {target_status}")
                            try:
                                assigned = self.assign_issue(key, assignee_email)
                                transitioned = self.transition_issue(key, target_status)
                                if not assigned:
                                    print(f"  Warning: assignment failed for {key}")
                                if not transitioned:
                                    print(f"  Warning: transition to {target_status} failed for {key}")
                            except Exception as inner_e:
                                print(f"  Error processing {key}: {inner_e}")
                    else:
                        print(f"Failed to search for '{kw}': {resp.status_code} - {resp.text}")
                except Exception as e:
                    print(f"Error while searching for '{kw}': {e}")

    def transition_issue(self, issue_key: str, target_status: str) -> bool:
        """Transition an issue to a target status (e.g., 'Done')."""
        # Get available transitions
        url = f"{self.base_url}/issue/{issue_key}/transitions"
        try:
            resp = requests.get(url, auth=self.auth, headers=self.headers)
            if resp.status_code == 200:
                transitions = resp.json().get("transitions", [])
                target_id = None
                for t in transitions:
                    if t.get("to", {}).get("name", "").lower() == target_status.lower():
                        target_id = t.get("id")
                        break
                
                if target_id:
                    # Perform transition
                    transition_url = f"{self.base_url}/issue/{issue_key}/transitions"
                    payload = {"transition": {"id": target_id}}
                    trans_resp = requests.post(transition_url, auth=self.auth, headers=self.headers, json=payload)
                    if trans_resp.status_code in [200, 204]:
                        print(f"  ✓ Transitioned {issue_key} to {target_status}")
                        return True
                    else:
                        print(f"  ✗ Failed to transition {issue_key}: {trans_resp.text}")
                else:
                    print(f"  ⚠ Status '{target_status}' not available for {issue_key}")
        except Exception as e:
            print(f"Error transitioning issue: {e}")
        return False

    def assign_issue(self, issue_key: str, assignee_email: str) -> bool:
        """Assign an issue to a user."""
        url = f"{self.base_url}/issue/{issue_key}/assignee"
        payload = {"emailAddress": assignee_email}
        try:
            resp = requests.put(url, auth=self.auth, headers=self.headers, json=payload)
            if resp.status_code in [200, 204]:
                print(f"  ✓ Assigned {issue_key} to {assignee_email}")
                return True
            else:
                print(f"  ✗ Failed to assign {issue_key}: {resp.text}")
        except Exception as e:
            print(f"Error assigning issue: {e}")
        return False

    def clean_board(self):
        """Delete all issues in the configured project (DESTRUCTIVE)."""
        print(f"\n⚠️  CLEANING BOARD - Deleting all issues in project {self.project_key}...")
        jql = f'project = {self.project_key}'
        url = f"{self.base_url}/search/jql"
        payload = {"jql": jql, "fields": ["key"], "maxResults": 100}
        try:
            resp = requests.post(url, auth=self.auth, headers=self.headers, json=payload)
            if resp.status_code == 200:
                issues = resp.json().get("issues", [])
                if not issues:
                    print("No issues found to delete.")
                    return
                print(f"Found {len(issues)} issues. Deleting...")
                for issue in issues:
                    key = issue.get("key")
                    del_url = f"{self.base_url}/issue/{key}"
                    del_resp = requests.delete(del_url, auth=self.auth, headers=self.headers)
                    if del_resp.status_code in [200, 204]:
                        print(f"  ✓ Deleted {key}")
                    else:
                        print(f"  ✗ Failed to delete {key}: {del_resp.status_code}")
                print(f"✓ Cleaned {len(issues)} issues from board.")
            else:
                print(f"Failed to query issues for deletion: {resp.status_code}")
        except Exception as e:
            print(f"Error cleaning board: {e}")

    def rebuild_board(self, assignee_email: str):
        """Rebuild the board with fresh Epics, Features, and Tasks, then assign and transition."""
        print("\n" + "="*60)
        print("REBUILDING BOARD - Creating fresh Epics, Features, Tasks")
        print("="*60)
        
        # Create Epic
        epic_key = self.create_epic(
            "Phase 1: Core Marketplace",
            "Phase 1 focuses on core marketplace infrastructure, PostgreSQL/MongoDB setup, Kafka messaging, and initial Java Spring Boot APIs."
        )
        if not epic_key:
            print("✗ Failed to create Phase 1 Epic. Aborting rebuild.")
            return
        
        # Feature 1: Infrastructure & Setup
        print("\nCreating Feature: Infrastructure & Setup")
        feature1_key = self.create_story(
            epic_key,
            "Infrastructure & Setup",
            "Docker Compose, PostgreSQL, MongoDB, Redis, Kafka, Zookeeper, and monitoring stack."
        )
        
        if feature1_key:
            tasks_done_1 = [
                ("Docker Compose Setup", "Set up docker-compose.yml with all services"),
                ("PostgreSQL Configuration", "Configure PostgreSQL with init scripts"),
                ("MongoDB Setup", "Configure MongoDB replica set"),
                ("Redis Setup", "Configure Redis caching layer"),
                ("Kafka & Zookeeper", "Set up Kafka cluster and Zookeeper"),
                ("Prometheus & Grafana", "Configure metrics and dashboards"),
                ("Nginx Reverse Proxy", "Configure Nginx for API gateway"),
            ]
            for task_name, task_desc in tasks_done_1:
                task_key = self.create_task(feature1_key, task_name, task_desc, "To Do")
                if task_key:
                    self.assign_issue(task_key, assignee_email)
                    self.transition_issue(task_key, "Done")
        
        # Feature 2: GitHub CI/CD Setup
        print("\nCreating Feature: GitHub CI/CD Setup")
        feature2_key = self.create_story(
            epic_key,
            "GitHub CI/CD Setup",
            "GitHub Actions workflows for Java, Frontend, and container registry (GHCR)."
        )
        
        if feature2_key:
            tasks_in_progress_2 = [
                ("Java Maven CI Workflow", "Create GitHub Actions for Java build/test"),
                ("Frontend Next.js CI Workflow", "Create GitHub Actions for frontend"),
                ("GHCR Publish Workflow", "Set up image push to GitHub Container Registry"),
                ("Push Repository to GitHub", "Initialize and push code to GitHub"),
            ]
            for task_name, task_desc in tasks_in_progress_2:
                task_key = self.create_task(feature2_key, task_name, task_desc, "To Do")
                if task_key:
                    self.assign_issue(task_key, assignee_email)
                    self.transition_issue(task_key, "In Progress")
        
        # Feature 3: Java Spring Boot - Core APIs
        print("\nCreating Feature: Java Spring Boot - Core APIs")
        feature3_key = self.create_story(
            epic_key,
            "Java Spring Boot - Core APIs",
            "Initial Java Spring Boot APIs for user, product, and order management."
        )
        
        if feature3_key:
            tasks_todo_3 = [
                ("User Management API", "Create user registration and login endpoints"),
                ("Product Catalog API", "Create product listing and search endpoints"),
                ("Order Management API", "Create order creation and tracking endpoints"),
                ("API Documentation (Swagger)", "Document APIs with Swagger/OpenAPI"),
            ]
            for task_name, task_desc in tasks_todo_3:
                task_key = self.create_task(feature3_key, task_name, task_desc, "To Do")
                if task_key:
                    self.assign_issue(task_key, assignee_email)
        
        # Feature 4: Database & Schema
        print("\nCreating Feature: Database & Schema")
        feature4_key = self.create_story(
            epic_key,
            "Database & Schema",
            "PostgreSQL schema, MongoDB collections, and migration scripts."
        )
        
        if feature4_key:
            tasks_mixed_4 = [
                ("PostgreSQL Schema Design", "Done", "Create tables for users, products, orders"),
                ("MongoDB Collections Setup", "Done", "Create collections for marketplace data"),
                ("Database Migration Scripts", "In Progress", "Write migration and backup scripts"),
            ]
            for task_name, status, task_desc in tasks_mixed_4:
                task_key = self.create_task(feature4_key, task_name, task_desc, "To Do")
                if task_key:
                    self.assign_issue(task_key, assignee_email)
                    self.transition_issue(task_key, status)
        
        # Feature 5: Next.js Frontend - Core Pages
        print("\nCreating Feature: Next.js Frontend - Core Pages")
        feature5_key = self.create_story(
            epic_key,
            "Next.js Frontend - Core Pages",
            "Initial Next.js frontend with home, product listing, and checkout."
        )
        
        if feature5_key:
            tasks_todo_5 = [
                ("Home Page", "Create home page with featured products"),
                ("Product Listing Page", "Create product catalog with filters"),
                ("Product Detail Page", "Create detailed product view"),
                ("Checkout Page", "Create checkout and payment flow"),
            ]
            for task_name, task_desc in tasks_todo_5:
                task_key = self.create_task(feature5_key, task_name, task_desc, "To Do")
                if task_key:
                    self.assign_issue(task_key, assignee_email)
        
        print("\n" + "="*60)
        print("✓ BOARD REBUILT SUCCESSFULLY")
        print("="*60)
        print(f"Visit your board: https://{self.domain}.atlassian.net/jira/software/projects/{self.project_key}/boards/1")

    def populate_phase_1(self):
        """Populate Phase 1: Core Marketplace (HIGH priority infrastructure + API tasks)."""
        print("\n" + "="*60)
        print("PHASE 1: Core Marketplace - Infrastructure & Deployment")
        print("="*60)
        
        # Create Epic
        epic_key = self.create_epic(
            "Phase 1: Core Marketplace",
            "Phase 1 focuses on core marketplace infrastructure, PostgreSQL/MongoDB setup, Kafka messaging, and initial Java Spring Boot APIs."
        )
        if not epic_key:
            return
        
        # Feature 1: Infrastructure & Setup
        feature1_key = self.create_story(
            epic_key,
            "Infrastructure & Setup",
            "Docker Compose, PostgreSQL, MongoDB, Redis, Kafka, Zookeeper, and monitoring stack."
        )
        
        if feature1_key:
            self.create_task(feature1_key, "Docker Compose Setup", "Set up docker-compose.yml with all services", "Done")
            self.create_task(feature1_key, "PostgreSQL Configuration", "Configure PostgreSQL with init scripts", "Done")
            self.create_task(feature1_key, "MongoDB Setup", "Configure MongoDB replica set", "Done")
            self.create_task(feature1_key, "Redis Setup", "Configure Redis caching layer", "Done")
            self.create_task(feature1_key, "Kafka & Zookeeper", "Set up Kafka cluster and Zookeeper", "Done")
            self.create_task(feature1_key, "Prometheus & Grafana", "Configure metrics and dashboards", "Done")
            self.create_task(feature1_key, "Nginx Reverse Proxy", "Configure Nginx for API gateway", "Done")
        
        # Feature 2: GitHub CI/CD Setup
        feature2_key = self.create_story(
            epic_key,
            "GitHub CI/CD Setup",
            "GitHub Actions workflows for Java, Frontend, and container registry (GHCR)."
        )
        
        if feature2_key:
            self.create_task(feature2_key, "Java Maven CI Workflow", "Create GitHub Actions for Java build/test", "In Progress")
            self.create_task(feature2_key, "Frontend Next.js CI Workflow", "Create GitHub Actions for frontend", "In Progress")
            self.create_task(feature2_key, "GHCR Publish Workflow", "Set up image push to GitHub Container Registry", "In Progress")
            self.create_task(feature2_key, "Push Repository to GitHub", "Initialize and push code to GitHub", "In Progress")
        
        # Feature 3: Java Spring Boot - Core APIs (planned for Phase 1)
        feature3_key = self.create_story(
            epic_key,
            "Java Spring Boot - Core APIs",
            "Initial Java Spring Boot APIs for user, product, and order management."
        )
        
        if feature3_key:
            self.create_task(feature3_key, "User Management API", "Create user registration and login endpoints", "To Do")
            self.create_task(feature3_key, "Product Catalog API", "Create product listing and search endpoints", "To Do")
            self.create_task(feature3_key, "Order Management API", "Create order creation and tracking endpoints", "To Do")
            self.create_task(feature3_key, "API Documentation (Swagger)", "Document APIs with Swagger/OpenAPI", "To Do")
        
        # Feature 4: Database & Schema
        feature4_key = self.create_story(
            epic_key,
            "Database & Schema",
            "PostgreSQL schema, MongoDB collections, and migration scripts."
        )
        
        if feature4_key:
            self.create_task(feature4_key, "PostgreSQL Schema Design", "Create tables for users, products, orders", "Done")
            self.create_task(feature4_key, "MongoDB Collections Setup", "Create collections for marketplace data", "Done")
            self.create_task(feature4_key, "Database Migration Scripts", "Write migration and backup scripts", "In Progress")
        
        # Feature 5: Next.js Frontend - Core Pages (planned)
        feature5_key = self.create_story(
            epic_key,
            "Next.js Frontend - Core Pages",
            "Initial Next.js frontend with home, product listing, and checkout."
        )
        
        if feature5_key:
            self.create_task(feature5_key, "Home Page", "Create home page with featured products", "To Do")
            self.create_task(feature5_key, "Product Listing Page", "Create product catalog with filters", "To Do")
            self.create_task(feature5_key, "Product Detail Page", "Create detailed product view", "To Do")
            self.create_task(feature5_key, "Checkout Page", "Create checkout and payment flow", "To Do")

    def run(self):
        """Run the full Jira integration."""
        print(f"\nConnecting to Jira: {self.domain}.atlassian.net (Project: {self.project_key})")
        
        if not self.get_project_id():
            print("✗ Could not connect to Jira project. Check your credentials and project key.")
            return
        
        print("✓ Connected to Jira project successfully.\n")
        
        # Populate Phase 1
        self.populate_phase_1()
        
        print("\n" + "="*60)
        print("JIRA INTEGRATION COMPLETE")
        print("="*60)
        print(f"Visit your board: https://{self.domain}.atlassian.net/jira/software/projects/{self.project_key}/boards/1")
        print("\nNext steps:")
        print("1. Review the Epics, Features, and Tasks on your Jira board")
        print("2. Update task statuses as work progresses")
        print("3. Use Jira comments to track daily progress")
        print("4. For Phase 2-4, re-run this script with different phase configurations")

def main():
    parser = argparse.ArgumentParser(description="Jira Integration Script")
    parser.add_argument("--domain", required=True, help="Jira domain (e.g., designercompk)")
    parser.add_argument("--email", required=True, help="Atlassian email")
    parser.add_argument("--token", required=True, help="API token")
    parser.add_argument("--project-key", required=False, default="KAN", help="Jira project key (e.g., KAN). Defaults to 'KAN' if omitted.")
    parser.add_argument("--list-epics", action="store_true", help="List existing Epics in the project and exit")
    parser.add_argument("--assign-phase1", action="store_true", help="Assign and transition Phase 1 tasks to the provided --email user")
    parser.add_argument("--clean-board", action="store_true", help="Delete all issues in the project (DESTRUCTIVE)")
    parser.add_argument("--rebuild-board", action="store_true", help="Delete all issues and rebuild with fresh Epics, Features, and Tasks (fully automated)")
    
    args = parser.parse_args()
    
    integration = JiraIntegration(
        domain=args.domain,
        email=args.email,
        token=args.token,
        project_key=args.project_key
    )
    if args.list_epics:
        integration.list_epics()
    elif args.assign_phase1:
        integration.assign_and_transition_phase1(args.email)
    elif args.clean_board:
        integration.clean_board()
    elif args.rebuild_board:
        integration.clean_board()
        integration.rebuild_board(args.email)
    else:
        integration.run()

if __name__ == "__main__":
    main()
