from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status

from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from api.serializers import AppointmentSerializer, ServiceSerializer, UserSerializer
from api.utils import checkDateAndTime, checkVerificationTwilio, sendVerificationTwilio

from .models import Appointment, Service
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from twilio.rest import Client

account_sid = "YOUR_ACCOUNT_SID"
auth_token = "YOUR_AUTH_TOKEN"
service_sid = "YOUR_SERVICE_SID"

client = Client(account_sid, auth_token)

@api_view(['GET'])
def index(request):
    return Response("Invalid Endpoint")

@api_view(['GET'])
def getServices(request):
    services = Service.objects.filter(name__icontains=request.GET.get('filter', ''))
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getServiceByName(request):
    service = get_object_or_404(Service, name=request.GET.get('name', ''))
    serializer = ServiceSerializer(service)
    return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def checkDate(request):
    res = checkDateAndTime(request.GET.get("date", ""), get_object_or_404(Service, name=request.GET.get("service", "")))

    if type(res) is dict:
        return Response(res, status=status.HTTP_400_BAD_REQUEST)

    return Response(res)

@api_view(['POST'])
def login(request):
    user = get_object_or_404(get_user_model(), phone=request.data['phone'])
    if not user.check_password(request.data['password']):
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    token = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)
    return Response({'token': token[0].key, 'user': serializer.data})

@api_view(['POST'])
def signup(request):
    if get_user_model().objects.filter(phone=request.data['phone']).exists():
        return Response({"Error": "Phone number is already associated to a different account"}, status=status.HTTP_400_BAD_REQUEST)
    
    res = sendVerificationTwilio(client, request.data["phone"], service_sid)

    if "Error" in res:
        return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(res, status=status.HTTP_202_ACCEPTED)

@api_view(['POST'])
def verifySignup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        res = checkVerificationTwilio(client, request.data["phone"], request.data["code"], service_sid)

        if type(res) is dict:
            return Response(res, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        user = get_object_or_404(get_user_model(), phone=request.data['phone'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key, 'user': UserSerializer(user).data})
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getUser(request):
    token = Token.objects.get_or_create(user=request.user)
    serializer = UserSerializer(request.user)
    return Response({'token': token[0].key, 'user': serializer.data})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getVerification(request):
    res = sendVerificationTwilio(client, request.user.phone.__str__(), service_sid)

    if "Error" in res:
        return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(res, status=status.HTTP_202_ACCEPTED)
    
@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def editUser(request):
    user = request.user
    res = checkVerificationTwilio(client, user.phone.__str__(), request.data["code"], service_sid)

    if type(res) is dict:
        return Response(res, status=status.HTTP_400_BAD_REQUEST)

    try:
        user.set_password(request.data["password"])
        user.save()
    except:
        return Response({"Error": "Inavlid Request data"}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(UserSerializer(user).data)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def deleteUser(request):
    user = request.user

    res = checkVerificationTwilio(client, user.phone.__str__(), request.data["code"], service_sid)

    if type(res) is dict:
        return Response(res, status=status.HTTP_400_BAD_REQUEST)

    user.delete()
    return Response({"Success": "User deleted successfully"})

@api_view(['POST'])
def resetPassword(request):
    if get_user_model().objects.filter(phone=request.data['phone']).exists() == False:
        return Response({"Error": "User does not Exist"}, status=status.HTTP_400_BAD_REQUEST)
    
    res = sendVerificationTwilio(client, request.data["phone"], service_sid)

    if "Error" in res:
        return Response(res, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(res, status=status.HTTP_202_ACCEPTED)

@api_view(['POST'])
def verifyResetPassword(request):
    res = checkVerificationTwilio(client, request.data["phone"], request.data["code"], service_sid)

    if type(res) is dict:
        return Response(res, status=status.HTTP_400_BAD_REQUEST)

    user = get_object_or_404(get_user_model(), phone=request.data['phone'])
    user.set_password(request.data['password'])
    user.save()
    token = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'user': UserSerializer(user).data})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def getAppointments(request):
    appointments = Appointment.objects.filter(user=request.user, status="pending")
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def addAppointment(request):
    date = request.data["date"]
    service = get_object_or_404(Service, name=request.data["service"])
    time = request.data["time"]

    res = checkDateAndTime(date, service, time)

    if type(res) is dict:
        return Response(res, status=status.HTTP_400_BAD_REQUEST)
    
    elif res:
        Appointment.objects.create(user=request.user, service=service, date=date, time=time)

    return Response({"success": "Appointment added successfully"})

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def deleteAppointment(request):
    appointment = get_object_or_404(Appointment, id=request.data["id"])
    if appointment.user != request.user or not appointment.isDeletable():
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    appointment.status = "canceled"
    return Response({"success": "Appointment deleted successfully"})