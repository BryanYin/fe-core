import { AbmRefreshStore, AbmStartRefresh, AbmStopRefresh } from '../refresh-decorator';

class B {

    public i: number;
    constructor() { this.i = 0; }

    @AbmStartRefresh(1)
    startRefresh() {
        this.add();
        return;
    }

    add() {
        // console.log('add running.');
        this.i++;
    }

    @AbmStopRefresh
    stopRefresh() {
        // console.log('refresh stopped');
        return;
    }

    hello() {
        console.log('hello from b');
    }
}

test('Refresh decorator start/end works', async () => {
    const bIns = new B();
    bIns.startRefresh();

    let ref = AbmRefreshStore.getMethodSub('B', 'startRefresh');
    expect(ref).toBeDefined();
    expect(ref?.sub$).toBeDefined();

    await new Promise(res => setTimeout(res, 3000));

    bIns.stopRefresh();
    expect(bIns.i).toBeGreaterThan(1);

    ref = AbmRefreshStore.getMethodSub('B', 'startRefresh');
    expect(ref?.sub$).toBeUndefined();
});
