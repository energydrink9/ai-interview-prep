from langchain_core.messages import HumanMessage, ToolMessage
from langchain.callbacks.base import BaseCallbackHandler

#chain_guard = LakeraChainGuard()

ENABLE_GUARD = False


class LakeraGuardHandler(BaseCallbackHandler):
    def on_llm_start(self, serialized, prompts, **kwargs):

        if ENABLE_GUARD is True:
            for prompt in prompts:
                if isinstance(prompt, HumanMessage) or isinstance(prompt, ToolMessage):
                    pass
                    #chain_guard.detect([prompt])


