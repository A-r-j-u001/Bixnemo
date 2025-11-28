from playwright.sync_api import sync_playwright

def verify_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to dashboard...")
            page.goto("http://localhost:3000/dashboard")
            
            # Since NextAuth might take a moment to determine session status and redirect,
            # we should wait for a bit or check if we are on dashboard (if loaded?) or signin.
            # If status is "loading", it shows "Loading...".
            
            # Wait for either dashboard content OR signin redirect
            # We expect Sign In because we are not authenticated.
            
            # Let's wait for url change or a specific selector
            try:
                page.wait_for_url("**/auth/signin**", timeout=5000)
                print("Redirected to Sign In page successfully.")
            except:
                print(f"Current URL: {page.url}")
                # If we are still on dashboard, maybe we are stuck on loading?
                content = page.content()
                if "Loading..." in content:
                    print("Stuck on Loading...")
                else:
                    print("Unknown state.")
            
            page.screenshot(path="verification/signin_page.png")
            
            print("Attempting Sign In...")
            page.fill("input[type='email']", "testuser@example.com")
            page.fill("input[type='password']", "password123")
            page.click("button[type='submit']")
            
            print("Waiting for Dashboard redirect...")
            page.wait_for_url("**/dashboard", timeout=10000)
            print("Logged in and on Dashboard.")
            
            page.wait_for_selector("text=Welcome back")
            page.screenshot(path="verification/dashboard.png")
            
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_dashboard()
