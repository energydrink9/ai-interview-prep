
from typing import cast
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import JSONResponse, RedirectResponse
import requests
import stripe

from auth import get_current_user, get_user_id
from environment import get_env

BILLING_ENABLED = True
INTERVIEW_SESSION_METER_NAME = 'interview_session_usage'
STRIPE_EVENT_NAME = 'interview_session_usage'
STRIPE_CURRENCY = 'usd'
STRIPE_SECRET_KEY = get_env('STRIPE_SECRET_KEY')
STRIPE_INTERVIEW_SESSION_PRICE_ID = 'price_1Qju4aDcG9aNPjMBgaktFz1i'

stripe.api_key = STRIPE_SECRET_KEY

router = APIRouter(prefix='/payments')


class CustomerNotFound(Exception):
    pass


def get_customer(user_id) -> stripe.Customer:
    results = stripe.Customer.search(query=f"metadata['user_id']:'{user_id}'")
    
    if len(results.data) == 0:
        raise CustomerNotFound()
    
    return cast(stripe.Customer, results.data[0])


@router.put('/balance/deduct')
async def record_usage(current_user: dict = Depends(get_current_user)):

    _, get_user_info = current_user

    try:
        if BILLING_ENABLED:
            user_id = get_user_id(get_user_info())

            stripe.Customer.create_balance_transaction(
                user_id,
                amount=-1,  # Negative to deduct
                currency=STRIPE_CURRENCY,
                description="Deducted 1 credit for service usage",
            )
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/balance')
async def get_balance(current_user: dict = Depends(get_current_user)):

    _, get_user_info = current_user

    try:
        if BILLING_ENABLED:
            user_id = get_user_id(get_user_info())

            # Retrieve the customer
            try:
                customer = get_customer(user_id)

                # Get their balance
                balance = customer["balance"]
            
            except CustomerNotFound:
                # If the customer doesn't exist, return 0
                balance = 0

        else:
            balance = 10

        return dict({'balance': balance})
            
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/checkout-link')
def checkout_link(request: Request, current_user: dict = Depends(get_current_user)):
    try:

        domain = request.base_url.__str__()
        print(domain)

        _, get_user_info = current_user
        user_info = get_user_info()
    
        user_id = get_user_id(user_info)

        try:
            customer = get_customer(user_id)

        except CustomerNotFound:
            customer = stripe.Customer.create(
                name=user_info.get('name'),
                email=user_info.get('email'),
                metadata={'user_id': user_id},
            )
    
        checkout_session = stripe.checkout.Session.create(
            customer=customer['id'],
            customer_update={'address': 'auto'},
            line_items=[
                {
                    'price': STRIPE_INTERVIEW_SESSION_PRICE_ID,
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url=domain + 'api/payments/stripe/successful-payment',
            cancel_url=domain + 'api/payments/stripe/cancelled-payment',
            automatic_tax={'enabled': True},
        )

        return JSONResponse(checkout_session.url, status_code=200)

    except Exception as e:
        return str(e)


# TODO: Implement success logic
@router.post('/stripe/successful-payment')
def successful_payment(current_user: dict = Depends(get_current_user)):
    _, get_user_info = current_user
    
    user_id = get_user_id(get_user_info())
    credits = 0  # TODO: Get the number of credits from the payment
    stripe.billing.CreditGrant.create(
        customer=user_id,
        category="paid",
        amount={"type": "monetary", "monetary": {"value": credits, "currency": "usd"}},
        applicability_config={"scope": {"price_type": "metered"}},
    )

    return RedirectResponse(url='https://localhost:3000/profile')


@router.post('/stripe/cancelled-payment')
def cancelled_payment():
    pass

