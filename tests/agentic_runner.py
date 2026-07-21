from browser_use import Agent, ChatBrowserUse

agent = Agent(
    task="Open the GitHub Pages cat game, select Cat 1, move in four directions with screenshots, verify idle pose, and report any sky-on-ground visual bleed.",
    llm=ChatBrowserUse(),
)
