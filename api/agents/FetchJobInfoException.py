from routers.response_model import ErrorModel
from agents.JobInfoModel import JobInfoErrorCodes


class FetchJobInfoException(Exception):
    def __init__(self, error: ErrorModel[JobInfoErrorCodes]):
        self.error = error
        super().__init__(error.message)