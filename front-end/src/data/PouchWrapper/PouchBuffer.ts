const INTERVAL = 1000;
const OPS_PER_INTERVAL = 10;

const DEQUEUE_INTERVAL = INTERVAL + 50; // the interval with which to look for new operations to queue.

const bufferedOperations = [] as {resolve: Function, reject: Function, operation: () => Promise<any>}[];
let operationsInInterval = 0;

export default <T>(operation: () => Promise<T>) : Promise<T> => {
  console.log(operationsInInterval);
  if (operationsInInterval >= OPS_PER_INTERVAL) {
    // put the operation on hold.
    console.log('buffering');
    return new Promise((resolve, reject) => {
      bufferedOperations.push({ resolve, reject, operation });
    });
  }
  console.log('executing');
  operationsInInterval += 1;
  return operation().then((val) => { setTimeout(() => { operationsInInterval -= 1; }, INTERVAL); return val; });
};

const handleNewInterval = () => {
  // Very poorly written, will attend later.
  if (operationsInInterval >= OPS_PER_INTERVAL) { return; }
  for (let curOperation = bufferedOperations.shift();
    curOperation !== undefined && operationsInInterval < OPS_PER_INTERVAL;) {
    operationsInInterval += 1;
    executeBufferedOperation(curOperation);
    if (operationsInInterval < OPS_PER_INTERVAL) { curOperation = bufferedOperations.shift(); }
  }
};

const executeBufferedOperation = (op: {resolve: Function, reject: Function, operation: () => Promise<any>}) => {
  console.log('executing buffered');

  op.resolve(
    op.operation()
      .then((val) => { setTimeout(() => { operationsInInterval -= 1; }, INTERVAL); return val; })
      .catch((e) => op?.reject(e)),
  );
};

setInterval(handleNewInterval, DEQUEUE_INTERVAL);
