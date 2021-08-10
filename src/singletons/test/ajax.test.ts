import { firstValueFrom } from "rxjs";
import { AbmHttpMethod, AbmHttpRequest, AbmServerType } from "../../main";
import { AbmDataConnection } from "../abm-data-connection";

const requests: AbmHttpRequest[] = [];
requests.push(new AbmHttpRequest('get', 'get', AbmHttpMethod.GET));
requests.push(new AbmHttpRequest('patch', 'patch', AbmHttpMethod.PATCH));
requests.push(new AbmHttpRequest('delete', 'delete', AbmHttpMethod.DELETE));
requests.push(new AbmHttpRequest('post', 'post', AbmHttpMethod.POST));
requests.push(new AbmHttpRequest('put', 'put', AbmHttpMethod.PUT));

test('Data connection should be intialized first', () => {
    expect(() => AbmDataConnection.getInstance()).toThrow();
});

test('Data connection can be obtained after init', () => {
    AbmDataConnection.initInstance(AbmServerType.DEFAULT, 'https://httpbin.org/', requests);
    expect(() => AbmDataConnection.getInstance()).toBeDefined();
});

test('Data connection can be obtained by name', () => {
    AbmDataConnection.initInstance(AbmServerType.DATA, 'https://httpbin.org/', requests);
    AbmDataConnection.initInstance('another server', 'https://httpbin.org/', requests);
    expect(() => AbmDataConnection.getInstance(AbmServerType.DATA)).toBeDefined();
    expect(() => AbmDataConnection.getInstance('another server')).toBeDefined();
    expect(() => AbmDataConnection.getInstance('not exist server')).toThrow();
});

test('ajax requests should success', () => {
    const dataConn = AbmDataConnection.getInstance();
    firstValueFrom(dataConn.request(dataConn.getRequest('get'))).then(data => expect(data).toBeDefined());
    firstValueFrom(dataConn.request(dataConn.getRequest('patch'))).then(data => expect(data).toBeDefined());
    firstValueFrom(dataConn.request(dataConn.getRequest('delete'))).then(data => expect(data).toBeDefined());
    firstValueFrom(dataConn.request(dataConn.getRequest('post'))).then(data => expect(data).toBeDefined());
    firstValueFrom(dataConn.request(dataConn.getRequest('put'))).then(data => expect(data).toBeDefined());
});

test('ajax simpleRequest should success', () => {
    firstValueFrom(AbmDataConnection.simpleGet('https://httpbin.org/get')).then(data => expect(data).toBeDefined());
});

