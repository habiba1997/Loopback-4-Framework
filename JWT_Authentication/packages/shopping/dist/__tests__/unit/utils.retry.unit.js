"use strict";
// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
const testlab_1 = require("@loopback/testlab");
const retry_1 = require("../../utils/retry");
describe('sleep()', () => {
    it('waits for given milliseconds', async () => {
        const start = Date.now();
        await retry_1.sleep(10);
        const duration = Date.now() - start;
        testlab_1.expect(duration).to.be.greaterThanOrEqual(10);
    });
    it('defaults invalid time to 1 ms', async () => {
        const start = Date.now();
        await retry_1.sleep(-100);
        const duration = Date.now() - start;
        testlab_1.expect(duration).to.be.greaterThanOrEqual(0);
    });
});
describe('retry()', () => {
    it('runs once if done', async () => {
        let count = 0;
        const fn = () => {
            // Always good on the 1st run
            count++;
            return 100;
        };
        const task = givenTask(fn);
        const num = await retry_1.retry(task, { maxTries: 5, interval: 1 });
        testlab_1.expect(num).to.eql(100);
        testlab_1.expect(count).to.eql(1);
    });
    it('retries until done', async () => {
        let count = 0;
        const fn = () => {
            if (count++ < 2)
                return null;
            return 1;
        };
        const task = givenTask(fn);
        const num = await retry_1.retry(task, { maxTries: 5, interval: 1 });
        testlab_1.expect(num).to.eql(1);
        testlab_1.expect(count).to.eql(3);
    });
    it('retries until done if error is ignored', async () => {
        let count = 0;
        const fn = () => {
            if (count++ < 1)
                return null;
            if (count === 2)
                throw new Error('fail');
            return 1;
        };
        const task = givenTask(fn, true);
        const num = await retry_1.retry(task, { maxTries: 5, interval: 1 });
        testlab_1.expect(num).to.eql(1);
        testlab_1.expect(count).to.eql(3);
    });
    it('retries fails if error is thrown', async () => {
        let count = 0;
        const fn = () => {
            if (count++ < 1)
                return null;
            if (count === 2)
                throw new Error('fail');
            return 1;
        };
        const task = givenTask(fn);
        return await testlab_1.expect(retry_1.retry(task, { maxTries: 5, interval: 1 })).to.be.rejectedWith(/fail/);
    });
    it('retries fails with timeout', async () => {
        let count = 0;
        const fn = () => {
            if (count++ < 10)
                return null;
            return count;
        };
        const task = givenTask(fn);
        return await testlab_1.expect(retry_1.retry(task, { maxTries: 5, interval: 1 })).to.be.rejectedWith(/Failed to count after 5 ms/);
    });
});
function givenTask(fn, ignoreError = false) {
    const task = {
        run: async () => {
            try {
                const result = fn();
                return { done: result != null, value: result };
            }
            catch (err) {
                if (ignoreError) {
                    return { done: false };
                }
                else {
                    throw err;
                }
            }
        },
        description: 'count',
    };
    return task;
}
//# sourceMappingURL=utils.retry.unit.js.map