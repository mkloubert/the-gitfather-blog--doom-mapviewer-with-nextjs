// MIT License
//
// Copyright (c) 2024 Marcel Joachim Kloubert (https://marcel.coffee)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const FILE_ID_SIZE = 4;

/**
 * A stream with a Buffer as data source.
 */
export class BufferStream {
    private readonly _buffer: Buffer;
    private _position: number = 0;

    /**
     * Initializes a new instance of that class.
     *
     * @param {Buffer} buf The underlying buffer.
     */
    constructor(buf: Buffer) {
        this._buffer = buf;
    }

    /**
     * Gets or sets the position as zero-based value.
     */
    get position(): number {
        return this._position;
    }
    set position(value: number) {
        this._position = Math.min(
            value,
            this._buffer.length
        );
    }

    /**
     * Reads the next number of bytes.
     *
     * @param {number} count The number of bytes to read.
     *
     * @returns {Buffer} The read data.
     */
    read(count: number): Buffer {
        const data = this._buffer.subarray(this.position, this.position + count);
        this.position += data.length;

        return data;
    }
}

/**
 * Line definitions, which are used to draw a map, e.g.
 */
export class LineDefs {
    private constructor(public start: Vertex, public end: Vertex) {
    }

    /**
     * Creates a new instance from a `BufferStream`.
     *
     * @param {BufferStream} stream The stream.
     * @param {Vertex[]} vertexes The list of vertexes.
     *
     * @returns {LineDefs|null} The new instance or `null`, if EOF.
     */
    public static fromBufferStream(
        stream: BufferStream,
        vertexes: Vertex[]
    ): LineDefs | null {
        let temp: Buffer;

        temp = stream.read(2);
        if (temp.length !== 2) {
            return null;
        }

        const startVertexIndex = temp.readInt16LE();

        temp = stream.read(2);
        if (temp.length !== 2) {
            return null;
        }

        const endVertexIndex = temp.readInt16LE();

        temp = stream.read(2);
        if (temp.length !== 2) {
            return null;
        }

        const flags = temp.readInt16LE();

        temp = stream.read(2);
        if (temp.length !== 2) {
            return null;
        }

        const specialType = temp.readInt16LE();

        temp = stream.read(2);
        if (temp.length !== 2) {
            return null;
        }

        const sectorTag = temp.readInt16LE();

        temp = stream.read(2);
        if (temp.length !== 2) {
            return null;
        }

        const sideDefRight = temp.readInt16LE();

        temp = stream.read(2);
        if (temp.length !== 2) {
            return null;
        }

        const sideDefLeft = temp.readInt16LE();

        const startVertex = vertexes[startVertexIndex];
        if (!startVertex) {
            return null;
        }

        const endVertex = vertexes[endVertexIndex];
        if (!endVertex) {
            return null;
        }

        return new LineDefs(startVertex, endVertex);
    }

    /**
     * Gets the length of the line.
     */
    get length(): number {
        const {
            x: x1,
            y: y1,
        } = this.start;
        const {
            x: x2,
            y: y2,
        } = this.end;

        const a = Math.abs(x1 - x2);
        const b = Math.abs(y1 - y2);

        // c
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    }

    /**
     * @inheritdoc
     */
    toJSON() {
        return {
            start: {
                x: this.start.x,
                y: this.start.y,
            },
            end: {
                x: this.end.x,
                y: this.end.y,
            },
        };
    }
}

/**
 * A lump.
 */
export class Lump {
    private constructor() {
    }

    /**
     * Creates a new instance from a `BufferStream`.
     *
     * @param {BufferStream} stream The stream.
     *
     * @returns {Lump|null} The new instance or `null` if not enough data is available.
     */
    static fromBufferStream(stream: BufferStream): Lump | null {
        let temp: Buffer;

        temp = stream.read(4);
        if (temp.length !== 4) {
            return null;  // not enough data for `lumpPos`
        }

        const lumpPos = temp.readInt32LE();

        temp = stream.read(4);
        if (temp.length !== 4) {
            return null;  // not enough data for `lumpSize`
        }

        const lumpSize = temp.readInt32LE();

        temp = stream.read(8);
        if (temp.length !== 8) {
            return null;  // not enough data for `lumpName`
        }

        // cleanup lump name from zero-bytes
        let lumpName = temp.toString('ascii');
        while (lumpName.endsWith(String.fromCharCode(0))) {
            lumpName = lumpName.substring(0, lumpName.length - 1);
        }

        // now we have anything we need
        const newLump: Lump = new Lump();
        newLump.name = lumpName;
        newLump.position = lumpPos;
        newLump.size = lumpSize;

        return newLump;
    }

    /**
     * The name.
     */
    name!: string;

    /**
     * The position inside wad file.
     */
    position!: number;

    /**
     * The size.
     */
    size!: number;
}

/**
 * A basic WAD file.
 */
export abstract class WADFileBase {
    private readonly _data: Buffer;

    /**
     * Initializes a new instance of that class.
     *
     * @param {WADFormat} format The format.
     */
    constructor(
        public readonly format: WADFormat,
        data: Uint8Array
    ) {
        this._data = Buffer.isBuffer(data) ?
            data :
            Buffer.from(data);
    }

    /**
     * Enumerates the LINEDEFS elements, while handling this WAD file as DOOM.WAD
     *
     * @param {number} episodeNr The number of episode.
     * @param {number} mapNr The number of map inside `episode`.
     *
     * @returns {Generator<LineDefs>} The stream of `LineDefs`s
     */
    *enumerateLineDefsOfDoom1Map(episodeNr: number, mapNr: number): Generator<LineDefs> {
        const mapLumpName = `E${episodeNr}M${mapNr}`;

        const allLumps = Array.from(this.enumerateLumps());

        const mapLumpIndex = allLumps.findIndex((lump) => {
            return lump.name === mapLumpName;
        });
        if (mapLumpIndex === -1) {
            return;
        }

        const stream = new BufferStream(this._data);

        const allLumpsOfMap: Lump[] = [];

        let offset = 0;
        while (mapLumpIndex + offset < allLumps.length) {
            ++offset;

            const lumpOfMap = allLumps[mapLumpIndex + offset];
            if (!lumpOfMap) {
                break;
            }

            const lumpName = String(lumpOfMap.name || '').toUpperCase().trim();
            if (new RegExp(/^(E)([0-9])/).test(lumpName)) {
                break;
            }

            allLumpsOfMap.push(lumpOfMap);
        };

        const lumpStream = this._enumerateLineDefsOfMap(
            stream, allLumps
        );
        for (const lump of Array.from(lumpStream)) {
            yield lump;
        }
    }

    /**
     * Enumerates the LINEDEFS elements, while handling this WAD file as DOOM2.WAD
     *
     * @param {number} episodeNr The number of episode.
     * @param {number} mapNr The number of map inside `episode`.
     *
     * @returns {Generator<LineDefs>} The stream of `LineDefs`s
     */
    *enumerateLineDefsOfDoom2Map(mapNr: number): Generator<LineDefs> {
        const mapLumpName = `MAP${mapNr.toString().padStart(2, '0')}`;

        const allLumps = Array.from(this.enumerateLumps());

        const mapLumpIndex = allLumps.findIndex((lump) => {
            return lump.name === mapLumpName;
        });
        if (mapLumpIndex === -1) {
            return;
        }

        const stream = new BufferStream(this._data);

        const allLumpsOfMap: Lump[] = [];

        let offset = 0;
        while (mapLumpIndex + offset < allLumps.length) {
            ++offset;

            const lumpOfMap = allLumps[mapLumpIndex + offset];
            if (!lumpOfMap) {
                break;
            }

            const lumpName = String(lumpOfMap.name || '').toUpperCase().trim();
            if (lumpName.startsWith('MAP')) {
                break;
            }

            allLumpsOfMap.push(lumpOfMap);
        };

        const lumpStream = this._enumerateLineDefsOfMap(
            stream, allLumps
        );
        for (const lump of Array.from(lumpStream)) {
            yield lump;
        }
    }

    private *_enumerateLineDefsOfMap(
        stream: BufferStream,
        allLumpsOfMap: Lump[]
    ): Generator<LineDefs> {
        const vertexesLumpOfMap = allLumpsOfMap.find((lump) => {
            return lump.name.toUpperCase().trim() === "VERTEXES";
        });
        if (!vertexesLumpOfMap) {
            return;  // we need a `VERTEXES` section
        }

        const vertexesOfMap: Vertex[] = [];
        stream.position = vertexesLumpOfMap.position;
        while (stream.position < vertexesLumpOfMap.position + vertexesLumpOfMap.size) {
            const newVertex = Vertex.fromBufferStream(stream);
            if (newVertex) {
                vertexesOfMap.push(newVertex);
            } else {
                break;
            }
        }

        const lindefsLump = allLumpsOfMap.find((lump) => {
            return lump.name.toUpperCase().trim() === "LINEDEFS";
        });
        if (!lindefsLump) {
            return;  // we need the `LINEDEFS` lump
        }

        // now extract the data ...
        stream.position = lindefsLump.position;
        while (stream.position < lindefsLump.position + lindefsLump.size) {
            const newLineDef = LineDefs.fromBufferStream(
                stream, vertexesOfMap
            );

            if (newLineDef) {
                yield newLineDef;
            } else {
                break;
            }
        }
    }

    /**
     * Enumerates list of lumps.
     *
     * @returns {Generator<Lump>} Stream of lumps.
     */
    *enumerateLumps(): Generator<Lump> {
        let temp: Buffer;

        const stream = new BufferStream(this._data);

        // skip header
        stream.position = FILE_ID_SIZE;

        temp = stream.read(4);
        if (temp.length !== 4) {
            return;  // not enough data for `lumpCount`
        }

        const lumpCount = temp.readInt32LE();

        temp = stream.read(4);
        if (temp.length !== 4) {
            return;  // not enough data for `lumpDirOffset`
        }

        const lumpDirOffset = temp.readInt32LE();

        stream.position = lumpDirOffset;
        for (let i = 0; i < lumpCount; i++) {
            const newLump = Lump.fromBufferStream(stream);

            if (newLump) {
                yield newLump;
            } else {
                break;
            }
        }
    }

    /**
     * Creates a new instance from a buffer.
     *
     * @param {Uint8Array} data The buffer / data.
     * @param {WADFormat} [format=WADFormat.Default] The explicit format.
     *
     * @returns {IWADFile|PWADFile} The new instance.
     */
    static fromBuffer(data: Uint8Array, format = WADFormat.Default): IWADFile | PWADFile {
        const buf = Buffer.isBuffer(data) ?
            data :
            Buffer.from(data);

        const header = buf.subarray(0, FILE_ID_SIZE).toString('ascii');

        if (header === "IWAD") {
            return new IWADFile(format, buf);
        } else if (header === "PWAD") {
            return new PWADFile(format, buf);
        }

        throw new TypeError('invalid WAD file format');
    }

    /**
     * The type.
     */
    readonly abstract type: WADType;
}

/**
 * An complete / internal WAD file.
 */
export class IWADFile extends WADFileBase {
    /**
     * @inheritdoc
     */
    readonly type: WADType = WADType.IWAD;
}

/**
 * An patch WAD file.
 */
export class PWADFile extends WADFileBase {
    /**
     * @inheritdoc
     */
    readonly type: WADType = WADType.PWAD;
}

/**
 * Vertex data.
 */
export class Vertex {
    private constructor(public x: number, public y: number) {
    }

    /**
     * Creates a new instance from a `BufferStream`.
     *
     * @param {BufferStream} stream The stream.
     *
     * @returns {Vertex|null} The new instance or `null` if EOF.
     */
    static fromBufferStream(stream: BufferStream): Vertex | null {
        let temp: Buffer;

        temp = stream.read(2);
        if (temp.length !== 2) {
            return null;  // not enough data for `x`
        }

        const x = temp.readInt16LE();

        temp = stream.read(2);
        if (temp.length !== 2) {
            return null;  // not enough data for `y`
        }

        const y = temp.readInt16LE();

        return new Vertex(x, y);
    }
}

/**
 * List of WAD formats.
 */
export enum WADFormat {
    /**
     * Default like DOOM
     */
    Default = 0,
    /**
     * Hexen
     */
    Hexen = 1,
    /**
     * Strife
     */
    Strife = 2,
}

/**
 * List of WAD types.
 */
export enum WADType {
    /**
     * Internal / complete WAD
     */
    IWAD = "IWAD",
    /**
     * Patch WAD
     */
    PWAD = "PWAD"
}
