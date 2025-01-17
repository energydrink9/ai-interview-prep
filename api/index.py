from flask import Flask, request, jsonify

from planner_agent import run_gather_agent

app = Flask(__name__)


@app.route('/interview-preparation-plan', methods=['POST'])
def interview_preparation_plan():
    data = request.get_json()

    job_url = data['jobUrl']
    applicant_profile_url = data['applicantProfileUrl']

    plan = run_gather_agent(job_url, applicant_profile_url)

    return jsonify({"description": f"Interview prep plan: {plan}"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5328)