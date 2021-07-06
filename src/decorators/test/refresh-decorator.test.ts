import { AbmHasRefresher, AbmRefresher, AbmStartRefresh, AbmStopRefresh } from '../refresh-decorator';

@AbmRefresher()
class A {
    b: B = new B();
    constructor(
        public a: string,
    ) { }
}

@AbmRefresher({ method: 'add', interval: 1 })
class B {

    public i: number;
    constructor() { this.i = 0; }

    @AbmStartRefresh
    startRefresh() {
        console.log('refresh started');
        return;
    }

    add() {
        console.log('add running.');
        this.i++;
    }

    @AbmStopRefresh
    stopRefresh() {
        console.log('refresh stopped');
        return;
    }

    hello() {
        console.log('hello from b');
    }
}

test('Class decorator default works', () => {
    expect((new A('a') as unknown as AbmHasRefresher).refreshInt).toBe(60);
});

test('Class decorator parameter works', () => {
    expect((new B() as unknown as AbmHasRefresher).refreshInt).toBe(1);
});

test('Refresh decorator start/end works', async () => {
    const bIns = new B();
    bIns.startRefresh();

    expect((bIns as unknown as AbmHasRefresher).refreshSub).toBeDefined();

    await new Promise(res => setTimeout(res, 3000));

    bIns.stopRefresh();
    expect(bIns.i).toBeGreaterThan(1);
    expect((bIns as unknown as AbmHasRefresher).refreshSub).toBeUndefined();
});
