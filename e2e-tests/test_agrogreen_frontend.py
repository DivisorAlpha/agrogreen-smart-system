import os
import time

import pytest
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as expected
from selenium.webdriver.support.ui import WebDriverWait


load_dotenv()

FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@agrogreen.com")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
SELENIUM_HEADLESS = os.getenv("SELENIUM_HEADLESS", "false").lower() == "true"


@pytest.fixture
def driver():
    chrome_options = Options()

    if SELENIUM_HEADLESS:
        chrome_options.add_argument("--headless=new")

    chrome_options.add_argument("--window-size=1440,1000")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    browser = webdriver.Chrome(options=chrome_options)
    browser.implicitly_wait(2)

    yield browser

    browser.quit()


def wait_for_page(driver, timeout=10):
    WebDriverWait(driver, timeout).until(
        lambda current_driver: current_driver.execute_script(
            "return document.readyState"
        ) == "complete"
    )


def login_as_admin(driver):
    driver.get(f"{FRONTEND_BASE_URL}/login")
    wait_for_page(driver)

    email_input = WebDriverWait(driver, 10).until(
        expected.presence_of_element_located((By.NAME, "email"))
    )

    password_input = driver.find_element(By.NAME, "password")

    email_input.clear()
    email_input.send_keys(ADMIN_EMAIL)

    password_input.clear()
    password_input.send_keys(ADMIN_PASSWORD)
    password_input.send_keys(Keys.ENTER)

    WebDriverWait(driver, 10).until(
        lambda current_driver: "/login" not in current_driver.current_url
    )

    wait_for_page(driver)


def assert_text_is_visible(driver, text, timeout=10):
    WebDriverWait(driver, timeout).until(
        expected.presence_of_element_located(
            (By.XPATH, f"//*[contains(normalize-space(), '{text}')]")
        )
    )


def test_login_page_should_render_correctly(driver):
    driver.get(f"{FRONTEND_BASE_URL}/login")
    wait_for_page(driver)

    assert driver.find_element(By.NAME, "email").is_displayed()
    assert driver.find_element(By.NAME, "password").is_displayed()

    assert "login" in driver.current_url.lower()


def test_admin_should_login_and_access_dashboard(driver):
    login_as_admin(driver)

    assert FRONTEND_BASE_URL in driver.current_url
    assert_text_is_visible(driver, "AgroGreen")


def test_admin_should_access_users_page(driver):
    login_as_admin(driver)

    driver.get(f"{FRONTEND_BASE_URL}/users")
    wait_for_page(driver)

    assert_text_is_visible(driver, "Gestión de usuarios")
    assert_text_is_visible(driver, "Listado de usuarios")


def test_admin_should_access_profile_page(driver):
    login_as_admin(driver)

    driver.get(f"{FRONTEND_BASE_URL}/profile")
    wait_for_page(driver)

    assert_text_is_visible(driver, "Perfil")
    assert_text_is_visible(driver, ADMIN_EMAIL)


def test_protected_route_without_login_should_redirect_to_login(driver):
    driver.get(f"{FRONTEND_BASE_URL}/users")
    wait_for_page(driver)

    WebDriverWait(driver, 10).until(
        lambda current_driver: "/login" in current_driver.current_url
    )

    assert "/login" in driver.current_url


def test_sidebar_navigation_should_show_main_modules(driver):
    login_as_admin(driver)

    expected_menu_items = [
        "Panel",
        "Monitoreo",
        "Gráficas",
        "Invernaderos",
        "Zonas",
        "Cultivos",
        "Sensores",
        "Actuadores",
        "Lecturas",
        "Reglas",
        "Alertas",
        "Perfil",
    ]

    for item in expected_menu_items:
        assert_text_is_visible(driver, item)