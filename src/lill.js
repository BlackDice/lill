const bData = Symbol('lill related data')
const bEmpty = Symbol('empty value')

const EMPTY_LIST_SIZE = 0

// simple internal counter of LiLL attached objects for debugging purposes
let idSequence = 0

/**
 * Setup owner object to become linked list.
 *
 * Related data are safely stored in the private property using the Symbol primitive.
 *
 * @param  {Owner} owner object or function to attach
 * @return {Owner}
 */
export function attach(owner) {
	if (!canBeAttached(owner)) {
		throw new TypeError('LiLL.attach needs an extensible object or function')
	}
	if (isAttached(owner)) {
		throw new TypeError('LiLL.attach cannot use already attached object')
	}

	owner[bData] = {
		// following symbols are added onto item objects to identify relations
		bOwner: Symbol('lill parent owner'),
		bNext: Symbol('lill next item'),
		bPrev: Symbol('lill previous item'),
		head: bEmpty,
		tail: bEmpty,
		size: EMPTY_LIST_SIZE,
		id: (idSequence += 1),
	}

	Object.seal(owner[bData])
	return owner
}

/**
 * Complete cleanup of previously attached object and its items.
 *
 * @param  {Owner} owner to be detached
 * @return {Owner}
 */
export function detach(owner) {
	clear(owner)
	owner[bData] = undefined
	return owner
}

/**
 * Add object to end of owner list.
 *
 * @param {Owner} owner object
 * @param {Item} item to be added
 * @return {Owner}
 */
export function add(owner, item) {
	const data = validateAttached(owner)
	validateItem(item, 'add')

	// item is already on this list
	if (item[data.bOwner] === owner) {
		return owner
	}

	// initial state of the item
	item[data.bNext] = bEmpty
	item[data.bPrev] = bEmpty
	item[data.bOwner] = owner

	// no head means there are no items at all
	if (data.head === bEmpty) {
		data.head = item
		data.tail = item
	} else {
		// item on the tail will link with new item
		data.tail[data.bNext] = item
		item[data.bPrev] = data.tail

		// add new item on the tail
		data.tail = item
	}

	data.size += 1
	return owner
}

/**
 * Check if the item is within the owner list
 * @param {Owner} owner object
 * @param {Item} item to check
 * @return {Boolean}
 */
export function has(owner, item) {
	const data = validateAttached(owner)
	validateItem(item, 'has')
	return item[data.bOwner] === owner
}

/**
 * Remove the item from given owner list.
 *
 * @param {Owner} owner object
 * @param {Item} item to remove
 * @return {Owner}
 */
export function remove(owner, item) {
	const data = validateAttached(owner)
	validateItem(item, 'remove')

	// item is not on this list
	if (item[data.bOwner] !== owner) {
		return owner
	}

	// shift head since the current is being removed
	if (data.head === item) {
		data.head = data.head[data.bNext]
	}

	// shift tail since the current is being removed
	if (data.tail === item) {
		data.tail = data.tail[data.bPrev]
	}

	const prev = item[data.bPrev]
	const next = item[data.bNext]

	// update neighbors
	if (prev !== bEmpty) {
		prev[data.bNext] = item[data.bNext]
	}

	if (next !== bEmpty) {
		next[data.bPrev] = item[data.bPrev]
	}

	// cleanup of removed item
	clearItem(item, data)

	data.size -= 1
	return owner
}

/**
 * Clear the list of all items.
 *
 * @param {Owner} owner object
 * @return {Owner}
 */
export function clear(owner) {
	const data = validateAttached(owner)

	let item = data.head
	while (item !== bEmpty) {
		const nextItem = item[data.bNext]
		clearItem(item, data)
		item = nextItem
	}

	data.head = bEmpty
	data.tail = bEmpty
	data.size = EMPTY_LIST_SIZE

	return owner
}

function clearItem(item, data) {
	item[data.bNext] = undefined
	item[data.bPrev] = undefined
	item[data.bOwner] = undefined
}

/**
 * Retrieve head (first) value of owner list.
 *
 * @param {Owner} owner object
 * @return {Item|null}
 */
export function getHead(owner) {
	const data = validateAttached(owner)
	return obtainTrueValue(data.head)
}

/**
 * Retrieve tail (last) value of owner list.
 *
 * @param {Owner} owner object
 * @return {Item|null}
 */
export function getTail(owner) {
	const data = validateAttached(owner)
	return obtainTrueValue(data.tail)
}

/**
 * Retrieve next item in the owner list based on passed one.
 *
 * @param {Owner} owner object
 * @param {Item} item to remove
 * @return {Item|null}
 */
export function getNext(owner, item) {
	return getNeighbor(owner, item, 'bNext')
}

/**
 * Retrieve previous item in the owner list based on passed one.
 *
 * @param {Owner} owner object
 * @param {Item} item to remove
 * @return {Item|null}
 */
export function getPrevious(owner, item) {
	return getNeighbor(owner, item, 'bPrev')
}

/**
 * Retrive current size of the owner list.
 *
 * @param {Owner} owner object
 * @return {Number}
 */
export function getSize(owner) {
	const data = validateAttached(owner)
	return data.size || EMPTY_LIST_SIZE
}

/**
 * Loop over items of the owner list with callback.
 *
 * @param {Owner} owner object
 * @param {Function} cb invoked with item and its index
 * @param {?*} ctx optional context for a callback
 * @return {Number} index of last item
 */
export function each(owner, cb, ctx) {
	const data = validateAttached(owner)

	if (typeof cb !== 'function') {
		throw new TypeError('LiLL.each method expects callback function')
	}

	const func = ctx === undefined ? func$noContext : func$withContext

	let i = 0
	let item = data.head

	while (item !== bEmpty) {
		// keep reference to next item in case the callback would modify the list
		const next = item[data.bNext]
		func(cb, item, i, ctx)
		item = next
		i += 1
	}

	return i
}

/**
 * Find item based on predicate within the owner list.
 *
 * Returning true value from a predicate function will stop iterating
 * immediatelly and return the item.
 *
 * @param {Owner} owner object
 * @param {Function} predicate invoked with item and its index
 * @param {?*} ctx optional context for a predicate
 * @return {Item|null}
 */
export function find(owner, predicate, ctx) {
	const data = validateAttached(owner)

	if (typeof predicate !== 'function') {
		throw new TypeError('LiLL.find method expects predicate function')
	}

	let i = 0
	let item = data.head

	const func = ctx === undefined ? func$noContext : func$withContext

	while (item !== bEmpty) {
		const next = item[data.bNext]
		const result = func(predicate, item, i, ctx)
		if (result === true) {
			return item
		}
		item = next
		i += 1
	}

	return null
}

/**
 * Create iterable object.
 *
 * @param {Owner} owner object
 * @return {Iterable}
 */
export function iterate(owner) {
	const data = validateAttached(owner)

	let item = data.head
	const next = () => {
		if (item === bEmpty) {
			return { done: true }
		}
		const result = { done: false, value: item }
		item = item[data.bNext]
		return result
	}

	return { [Symbol.iterator]() {
		return { next }
	} }
}

/**
 * Check if owner object is attached.
 *
 * @param {Owner} owner object
 * @return {Boolean}
 */
export function isAttached(owner) {
	return owner && owner[bData] !== undefined
}

/**
 * Check if object can actually be attached.
 *
 * @param {Owner} owner object
 * @return {Boolean}
 */
export function canBeAttached(object) {
	if (object === undefined || object === null) {
		return false
	}
	const objectType = typeof object
	return (objectType === 'object' || objectType === 'function') && Object.isExtensible(object)
}

// faster invocation of callback without changing context
function func$noContext(fn, item, i) {
	return fn(item, i)
}

// bit slower to use call when changing context
function func$withContext(fn, item, i, ctx) { // eslint-disable-line max-params
	return fn.call(ctx, item, i)
}

// convert empty symbol value to regular null or just pass through.
function obtainTrueValue(value) {
	if (value === bEmpty) {
		return null
	}
	return value
}

// just wrapper to minimize duplicate code
function getNeighbor(owner, item, dataPropertyName) {
	const data = validateAttached(owner)
	return obtainTrueValue(item[data[dataPropertyName]])
}

function validateAttached(owner) {
	if (!isAttached(owner)) {
		throw new TypeError('use LiLL.attach() method to setup owner object')
	}
	return owner[bData]
}

function validateItem(item, method) {
	if (!canBeAttached(item)) {
		throw new TypeError(`LiLL ${method} needs an extensible object or function`)
	}
}

// to allow `import Lill from 'lill'` syntax
export default module.exports

/**
 * @typedef {object|function} Owner
 */

/**
 * @typedef {object|function} Item
 */
