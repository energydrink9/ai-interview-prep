from langchain_community.agent_toolkits import PlayWrightBrowserToolkit
from langchain_community.tools.playwright.utils import create_async_playwright_browser
from langchain_community.tools.tavily_search import TavilySearchResults

browser = create_async_playwright_browser()
browser_toolkit = PlayWrightBrowserToolkit.from_browser(async_browser=browser)
browser_tools = [tool for tool in browser_toolkit.get_tools()] # if isinstance(tool, NavigateTool) or isinstance(tool, ExtractTextTool)]

search_tool = TavilySearchResults(max_results=10)