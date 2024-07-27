from django.conf import settings
from .models import User
from django.contrib.auth.backends import BaseBackend

class EmailOrUsernameModelBackend(BaseBackend):
    """
    This is a ModelBacked that allows authentication
    with either a username or an email address.
    
    """
    def authenticate(self, request, username=None, password=None):
        if '@' in username:
            kwargs = {'email': username}
        else:
            kwargs = {'username': username}
        try:
            user = User.objects.get(**kwargs)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
        return None
    