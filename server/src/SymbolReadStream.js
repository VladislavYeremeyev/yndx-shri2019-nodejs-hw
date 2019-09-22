var util = require('util'),
	fs = require('fs'),
	Readable = require('stream').Readable;

function SymbolReadStream(filename, options, dict) {
	if (!(this instanceof SymbolReadStream)) {
		return new SymbolReadStream(length, options);
	}

	Readable.call(this);
	this._readable = fs.createReadStream(filename, options);
	this.result = dict || {};
}

util.inherits(SymbolReadStream, Readable);

SymbolReadStream.prototype._read = function() {
	var self = this;
	this._readable.on('readable', function() {
		var chunk;
		while (null !== (chunk = self._readable.read(1))) {
			self.emit('data', chunk);
		}
	});
	this._readable.on('end', function() {
		self.emit('end');
	});
};

module.exports = SymbolReadStream;
