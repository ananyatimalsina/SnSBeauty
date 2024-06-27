from .models import Appointment

from datetime import datetime, time, timedelta
from django.utils import timezone

def checkDateAndTime(inputDate, service, inputTime=""):
    current_datetime = timezone.now()

    try:
        date = datetime.strptime(inputDate, "%Y-%m-%d").date()
    except ValueError:
        return {'Error': 'Invalid Date'}

    if date < current_datetime.date():
        return {'Error': 'Invalid Date'}
    
    if date > current_datetime.date() + timedelta(days=60):
        return {'Error': 'Invalid Date'}

    if inputTime != "":
        try:
            input_datetime = timezone.make_aware(datetime.combine(date, datetime.strptime(inputTime, '%H:%M').time()))

            if input_datetime <= current_datetime:
                return {'Error': 'Invalid Time'}
            
        except ValueError:
            return {'Error': 'Invalid Time'}

    booked_appointments = Appointment.objects.filter(service=service, date=date, status="pending")

    available_times = []

    opening_time = time(9, 0)  # 09:00 AM
    closing_time = time(18, 0)  # 06:00 PM
    
    current_time_slot = timezone.make_aware(datetime.combine(date, opening_time))

    while current_time_slot <= timezone.make_aware(datetime.combine(date, closing_time)):
        available_times.append(current_time_slot.strftime('%H:%M'))
        current_time_slot += timedelta(minutes=service.duration + 5)

    if len(booked_appointments) != 0:
        for appointment in booked_appointments:
            if appointment.time.strftime('%H:%M') in available_times:
                available_times.remove(appointment.time.strftime('%H:%M'))    

    if inputTime != "":
        if inputTime in available_times:
            return True
        else:
            return False

    return available_times

def sendVerificationTwilio(client, phone, service_sid):
    try:
        verification = client.verify \
                        .v2 \
                        .services(service_sid) \
                        .verifications \
                        .create(to=phone, channel='sms')
        
    except Exception as e:
        print(e)
        return {"Error": "Invalid Verification Configuration"}
    
    if verification.status == 'pending':
        return {"Success": "Verification sent!"}
        
    return {"Error": "Invalid Phone number"}

def checkVerificationTwilio(client, phone, code, service_sid):
    try:
        verification_check = client.verify \
                        .v2 \
                        .services(service_sid) \
                        .verification_checks \
                        .create(to=phone, code=code)
            
    except Exception as e:
        print(e)
        return {"Error": "Invalid Verification Configuration"}
    if verification_check.status == 'approved':
        return True
    
    return {"Error": "Invalid verification code"}