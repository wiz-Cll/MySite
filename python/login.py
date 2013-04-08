# encoding=utf-8
import xmlrpclib

env = 'local'

as_endpoint = ''
ks_endpoint = ''
user_id = ''
password = ''

if env == 'local':
    as_endpoint = 'http://192.168.0.111/wizas/xmlrpc'
    ks_endpoint = 'http://192.168.0.111/wizks/xmlrpc'
    user_id = '1@1.com'
    password = '111111'
elif env == 'local_ent':
    as_endpoint = 'http://127.0.0.1:8800/wizas/xmlrpc'
    ks_endpoint = 'http://127.0.0.1:6080/wizks/xmlrpc'
    user_id = 'a@a.com'
    password = '111111'

elif env == 'test_ent':
    as_endpoint = 'http://192.168.0.166:8080/wizas/xmlrpc'
    ks_endpoint = 'http://192.168.0.166:8080/wizks/xmlrpc'
    user_id = 'a@a.com'
    password = '111111'

elif env == 'local_km':
    as_endpoint = 'http://127.0.0.1:8080/wizkm/xmlrpc'
    ks_endpoint = as_endpoint 
    user_id = 'a@a.com'
    password = '111111'

elif env =='107_test':
    as_endpoint = 'http://42.121.35.107/wizas/xmlrpc'
    ks_endpoint = 'http://42.121.35.107/wizks/xmlrpc'
    user_id = 'admin'
    password = '111111'

else :
    print 'env not set!'
    exit()

print 'as地址:',as_endpoint
print ''
wizas = xmlrpclib.ServerProxy(as_endpoint)
wizks = xmlrpclib.ServerProxy(ks_endpoint)

param_login = {
    'user_id': user_id,
    'password': password,
    'api_version': 4
}

response_login = wizas.accounts.clientLogin(param_login)
print repr(response_login)

token = response_login['token']
print 'token\r\n',token
user_guid = response_login['user']['user_guid']
kb_guid = response_login['kb_guid']
print 'kb_guid',kb_guid

value_of_key = '妈的，中文测试';


param_set_value = {
    'token': token,
    'kb_guid':kb_guid,
    'key': 'folders',
    'value_of_key': value_of_key 
}



#response_set_value = s.kb.setValue(param_set_value)

#print repr(response_set_value)

param_get_group_list = {
    'token': token,
    'kb_type': 'group'
}

response_get_group_list = wizas.accounts.getGroupKbList(param_get_group_list)

#print repr(response_get_group_list)

param_get_info = {
    'token':token
}
response_get_info = wizks.wiz.getInfo(param_get_info)
#print repr(response_get_info)

param_get_version = {
    'token': token
}

response_get_version = wizks.wiz.getVersion(param_get_version);

#print repr(response_get_version)


param_get_simplelist = {
    'token': token
}

response_get_simplelist = wizks.document.getSimpleList(param_get_simplelist)

print repr(response_get_simplelist)