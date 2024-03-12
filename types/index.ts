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
 * This files comes originally from `dwad-net` project:
 * 
 * https://github.com/mkloubert/dwad-net/blob/master/MarcelJoachimKloubert.DWAD/WADs/Lumps/Things/DOOMThingFlags.cs
 * 
 * @see https://doom.wikia.com/wiki/Thing
 */
export enum DOOMThingFlags {
    /// <summary>
    /// Thing is on skill levels 1 and 2
    /// </summary>
    Skill_1_and_2 = 0x0001,

    /// <summary>
    /// Thing is on skill levels 3
    /// </summary>
    Skill_3 = 0x0002,

    /// <summary>
    /// Thing is on skill levels 4 and 5
    /// </summary>
    Skill_4_and_5 = 0x0004,

    /// <summary>
    /// Thing is deaf.
    /// </summary>
    Deaf = 0x0008,

    /// <summary>
    /// Thing is not in single player
    /// </summary>
    NotInSinglePlayer = 0x0010,

    /// <summary>
    /// Thing is not in deathmatch (Boom)
    /// </summary>
    NotInDeathmatch = 0x0020,

    /// <summary>
    /// Thing is not in coop (Boom)
    /// </summary>
    NotInCoop = 0x0040,

    /// <summary>
    /// Friendly monster (MBF)
    /// </summary>
    FriendlyMonster = 0x0080,
}

/**
 * This files comes originally from `dwad-net` project:
 * 
 * https://github.com/mkloubert/dwad-net/blob/master/MarcelJoachimKloubert.DWAD/WADs/Lumps/Things/DOOMThingType.cs
 * 
 * @see https://doom.wikia.com/wiki/Thing_types
 */
export enum DOOMThingType {
    /// <summary>
    /// Unknown
    /// </summary>
    UNKNOWN = 0x0000,


    // #region Ammunition

    /// <summary>
    /// Ammo clip
    /// </summary>
    AmmoClip = 0x07D7,

    /// <summary>
    /// Box of ammo
    /// </summary>
    BoxOfAmmo = 0x0800,

    /// <summary>
    /// Box of rockets
    /// </summary>
    BoxOfRockets = 0x07FE,

    /// <summary>
    /// Box of shells
    /// </summary>
    BoxOfShells = 0x0801,

    /// <summary>
    /// Cell charge
    /// </summary>
    CellCharge = 0x07FF,

    /// <summary>
    /// Cell charge pack
    /// </summary>
    CellChargePack = 0x0011,

    /// <summary>
    /// Rocket
    /// </summary>
    Rocket = 0x07DA,

    /// <summary>
    /// Shotgun shells
    /// </summary>
    ShotgunShells = 0x07D8,

    // #endregion Ammunition

    // #region Artifacts

    /// <summary>
    /// Berserk
    /// </summary>
    Berserk = 0x07E7,

    /// <summary>
    /// Computer map
    /// </summary>
    ComputerMap = 0x07EA,

    /// <summary>
    /// Health potion
    /// </summary>
    HealthPoition = 0x07DE,

    /// <summary>
    /// Invisibility
    /// </summary>
    Invisibility = 0x07E8,

    /// <summary>
    /// Invulnerability
    /// </summary>
    Invulnerability = 0x07E6,

    /// <summary>
    /// Light amplification visor
    /// </summary>
    LightAmplicationVisor = 0x07FD,

    /// <summary>
    /// Megasphere
    /// </summary>
    Megasphere = 0x0053,

    /// <summary>
    /// Soul sphere
    /// </summary>
    SoulSphere = 0x07DD,

    /// <summary>
    /// Spiritual armor
    /// </summary>
    SpiritualArmor = 0x07DF,

    // #endregion Artifacts

    // #region Decorations

    /// <summary>
    /// Bloody mess #1
    /// </summary>
    BloodyMess1 = 0x000A,

    /// <summary>
    /// Bloody mess #2
    /// </summary>
    BloodyMess2 = 0x000C,

    /// <summary>
    /// Candle
    /// </summary>
    Candle = 0x0022,

    /// <summary>
    /// Dead cacodemon
    /// </summary>
    DeadCacodemon = 0x0016,

    /// <summary>
    /// Dead demon
    /// </summary>
    DeadDemon = 0x0015,

    /// <summary>
    /// Dead former human
    /// </summary>
    DeadFormerHuman = 0x0012,

    /// <summary>
    /// Dead former sergeant
    /// </summary>
    DeadFormerSergeant = 0x0013,

    /// <summary>
    /// Dead imp
    /// </summary>
    DeadImp = 0x0014,

    /// <summary>
    /// Dead player
    /// </summary>
    DeadPlayer = 0x000F,

    /// <summary>
    /// Hanging leg #1
    /// </summary>
    HangingLeg1 = 0x003E,

    /// <summary>
    /// Hanging pair of legs #1
    /// </summary>
    HangingPairOfLegs1 = 0x003C,

    /// <summary>
    /// Hanging victim, arms out #1
    /// </summary>
    HangingVictimArmsOut1 = 0x003B,

    /// <summary>
    /// Hanging victim, one-legged #1
    /// </summary>
    HangingVictimOneLegged1 = 0x003D,

    /// <summary>
    /// Hanging victim, twitching #1
    /// </summary>
    HangingVictimTwitching1 = 0x003F,

    /// <summary>
    /// Dead lost soul (invisible)
    /// </summary>
    InvisibleDeadLostSoul = 0x0017,

    /// <summary>
    /// Pool of blood #1
    /// </summary>
    PoolOfBlood1 = 0x004F,

    /// <summary>
    /// Pool of blood #2
    /// </summary>
    PoolOfBlood2 = 0x0050,

    /// <summary>
    /// Pool of blood and flesh
    /// </summary>
    PoolOfBloodAndFlesh = 0x0018,

    /// <summary>
    /// Pool of brains
    /// </summary>
    PoolOfBrains = 0x0051,

    // #endregion Decorations

    // #region Keys

    /// <summary>
    /// Blue keycard
    /// </summary>
    BlueKeycard = 0x0005,

    /// <summary>
    /// Blue skull key
    /// </summary>
    BlueSkullKey = 0x0028,

    /// <summary>
    /// Red keycard
    /// </summary>
    RedKeycard = 0x000D,

    /// <summary>
    /// Red skull key
    /// </summary>
    RedSkullKey = 0x0026,

    /// <summary>
    /// Yellow keycard
    /// </summary>
    YellowKeycard = 0x0006,

    /// <summary>
    /// Yellow skull key
    /// </summary>
    YellowSkullKey = 0x0027,

    // #endregion Keys

    // #region Monsters

    /// <summary>
    /// Arachnotron
    /// </summary>
    Arachnotron = 0x0044,

    /// <summary>
    /// Arch-Vile
    /// </summary>
    ArchVile = 0x0040,

    /// <summary>
    /// Baron of Hell
    /// </summary>
    BaronOfHell = 0x0BBB,

    /// <summary>
    /// Cacodemon
    /// </summary>
    Cacodemon = 0x0BBD,

    /// <summary>
    /// Chaingunner
    /// </summary>
    Chaingunner = 0x0041,

    /// <summary>
    /// Commander Keen
    /// </summary>
    CommanderKeen = 0x0048,

    /// <summary>
    /// Cyberdemon
    /// </summary>
    Cyberdemon = 0x0010,

    /// <summary>
    /// Demon
    /// </summary>
    Demon = 0x0BBA,

    /// <summary>
    /// FormerHumanTrooper
    /// </summary>
    FormerHumanTrooper = 0x0BBC,

    /// <summary>
    /// Former Human Sergeant
    /// </summary>
    FormerHumanSergeant = 0x0009,

    /// <summary>
    /// Hell Knight
    /// </summary>
    HellKnight = 0x0045,

    /// <summary>
    /// Imp
    /// </summary>
    Imp = 0x0BB9,

    /// <summary>
    /// Lost Soul
    /// </summary>
    LostSoul = 0x0BBE,

    /// <summary>
    /// Mancubus
    /// </summary>
    Mancubus = 0x0043,

    /// <summary>
    /// Pain Elemental
    /// </summary>
    PainElemental = 0x0047,

    /// <summary>
    /// Revenant
    /// </summary>
    Revenant = 0x0042,

    /// <summary>
    /// Spectre
    /// </summary>
    Spectre = 0x003A,

    /// <summary>
    /// Spider Mastermind
    /// </summary>
    SpiderMastermind = 0x0007,

    /// <summary>
    /// Wolfenstein soldier
    /// </summary>
    WolfensteinSoldier = 0x0054,

    // #endregion Monsters

    // #region Obstacles

    /// <summary>
    /// Barrel
    /// </summary>
    Barrel = 0x07F3,

    /// <summary>
    /// Burning barrel
    /// </summary>
    BurningBarrel = 0x0046,

    /// <summary>
    /// Burnt tree
    /// </summary>
    BurntTree = 0x002B,

    /// <summary>
    /// Candelabra
    /// </summary>
    Candelabra = 0x0023,

    /// <summary>
    /// Evil eye
    /// </summary>
    EvilEye = 0x0029,

    /// <summary>
    /// Five skulls &quot;shish kebab&quot;
    /// </summary>
    FiveSkullsShishKebab = 0x001C,

    /// <summary>
    /// Floating skull
    /// </summary>
    FloatingSkull = 0x002A,

    /// <summary>
    /// Floor lamp
    /// </summary>
    FloorLamp = 0x07EC,

    /// <summary>
    /// Hanging leg #2
    /// </summary>
    HangingLeg2 = 0x0035,

    /// <summary>
    /// Hanging pair of legs #2
    /// </summary>
    HangingPairOfLegs2 = 0x0034,

    /// <summary>
    /// Hanging torso, brain removed
    /// </summary>
    HangingTorsoBrainRemoved = 0x004E,

    /// <summary>
    /// Hanging torso, looking down
    /// </summary>
    HangingTorsoLookingDown = 0x004B,

    /// <summary>
    /// Hanging torso, looking up
    /// </summary>
    HangingTorsoLookingUp = 0x004D,

    /// <summary>
    /// Hanging torso, open skull
    /// </summary>
    HangingTorsoOpenSkull = 0x004C,

    /// <summary>
    /// Hanging victim, arms out #2
    /// </summary>
    HangingVictimArmsOut = 0x0032,

    /// <summary>
    /// Hanging victim, guts and brain removed
    /// </summary>
    HangingVictimGutsAndBrainRemoved = 0x004A,

    /// <summary>
    /// Hanging victim, guts removed
    /// </summary>
    HangingVictimGutsRemoved = 0x0049,

    /// <summary>
    /// Hanging victim, one-legged #2
    /// </summary>
    HangingVictimOneLegged2 = 0x0033,

    /// <summary>
    /// Hanging victim, twitching #2
    /// </summary>
    HangingVictimTwitching2 = 0x0031,

    /// <summary>
    /// Impaled human
    /// </summary>
    ImpaledHuman = 0x0019,

    /// <summary>
    /// Large brown tree
    /// </summary>
    LargeBrownTree = 0x0036,

    /// <summary>
    /// Pile of skulls and candles
    /// </summary>
    PileOfSkullsAndCandles = 0x001D,

    /// <summary>
    /// Short blue firestick
    /// </summary>
    ShortBlueFirestick = 0x0037,

    /// <summary>
    /// Short green firestick
    /// </summary>
    ShortGreenFirestick = 0x0038,

    /// <summary>
    /// Short green pillar
    /// </summary>
    ShortGreenPillar = 0x001F,

    /// <summary>
    /// Short green pillar with beating heart
    /// </summary>
    ShortGreenPillarWithBeatingHeart = 0x0024,

    /// <summary>
    /// Short red firestick
    /// </summary>
    ShortRedFirestick = 0x0039,

    /// <summary>
    /// Short red pillar
    /// </summary>
    ShortRedPillar = 0x0021,

    /// <summary>
    /// Short red pillar with skull
    /// </summary>
    ShortRedPillarWithSkull = 0x0025,

    /// <summary>
    /// Short techno floor lamp
    /// </summary>
    ShortTechnoFloorLamp = 0x0056,

    /// <summary>
    /// Skull on a pole
    /// </summary>
    SkullOnAPole = 0x001B,

    /// <summary>
    /// Stalagmite
    /// </summary>
    Stalagmite = 0x002F,

    /// <summary>
    /// Tall blue firestick
    /// </summary>
    TallBlueFirestick = 0x002C,

    /// <summary>
    /// Tall green firestick
    /// </summary>
    TallGreenFirestick = 0x002D,

    /// <summary>
    /// Tall green pillar
    /// </summary>
    TallGreenPillar = 0x001E,

    /// <summary>
    /// Tall red firestick
    /// </summary>
    TallRedFirestick = 0x002E,

    /// <summary>
    /// Tall red pillar
    /// </summary>
    TallRedPillar = 0x0020,

    /// <summary>
    /// Tall techno floor lamp
    /// </summary>
    TallTechnoFloorLamp = 0x0055,

    /// <summary>
    /// Tall techno pillar
    /// </summary>
    TallTechnoPillar = 0x0030,

    /// <summary>
    /// Twitching impaled human
    /// </summary>
    TwitchingImpaledHuman = 0x001A,

    // #endregion Obstacles

    // #region Other

    /// <summary>
    /// Boss Brain
    /// </summary>
    BossBrain = 0x0058,

    /// <summary>
    /// Deathmatch start
    /// </summary>
    DeathmatchStart = 0x000B,

    /// <summary>
    /// Player 1 start
    /// </summary>
    Player1Start = 0x001,

    /// <summary>
    /// Player 2 start
    /// </summary>
    Player2Start = 0x002,

    /// <summary>
    /// Player 3 start
    /// </summary>
    Player3Start = 0x003,

    /// <summary>
    /// Player 4 start
    /// </summary>
    Player4Start = 0x004,

    /// <summary>
    /// Spawn shooter
    /// </summary>
    SpawnShooter = 0x0059,

    /// <summary>
    /// Spawn spot
    /// </summary>
    SpawnSpot = 0x0057,

    /// <summary>
    /// Teleport landing
    /// </summary>
    TeleportLanding = 0x000E,

    // #endregion Other

    // #region Powerups

    /// <summary>
    /// Backpack
    /// </summary>
    Backpack = 0x0008,

    /// <summary>
    /// Blue armor
    /// </summary>
    BlueArmor = 0x07E3,

    /// <summary>
    /// Green armor
    /// </summary>
    GreenArmor = 0x07E2,

    /// <summary>
    /// Medikit
    /// </summary>
    Medikit = 0x07DC,

    /// <summary>
    /// Radiation suit
    /// </summary>
    RadiationSuit = 0x07E9,

    /// <summary>
    /// Stimpack
    /// </summary>
    Stimpack = 0x07DB,

    // #endregion Powerups

    // #region Weapons

    /// <summary>
    /// BFG 9000
    /// </summary>
    BFG9000 = 0x07D6,

    /// <summary>
    /// Chaingun
    /// </summary>
    Chaingun = 0x07D2,

    /// <summary>
    /// Chainsaw
    /// </summary>
    Chainsaw = 0x07D5,

    /// <summary>
    /// Plasma rifle
    /// </summary>
    PlasmaRifle = 0x07D4,

    /// <summary>
    /// Rocket launcher
    /// </summary>
    RocketLauncher = 0x07D3,

    /// <summary>
    /// Shotgun
    /// </summary>
    Shotgun = 0x07D1,

    /// <summary>
    /// Super shotgun
    /// </summary>
    SuperShotgun = 0x0052,

    // #endregion Weapons
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
        const lineDefStream = this._enumerateLineDefsOfMap(
            new BufferStream(this._data),
            Array.from(this._enumerateDoom1MapLumps(episodeNr, mapNr))
        );

        for (const lineDef of Array.from(lineDefStream)) {
            yield lineDef;
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
        const lineDefStream = this._enumerateLineDefsOfMap(
            new BufferStream(this._data),
            Array.from(this._enumerateDoom2MapLumps(mapNr))
        );

        for (const lineDef of Array.from(lineDefStream)) {
            yield lineDef;
        }
    }

    private *_enumerateDoom1MapLumps(episodeNr: number, mapNr: number): Generator<Lump> {
        const mapLumpName = `E${episodeNr}M${mapNr}`;

        const allLumps = Array.from(this.enumerateLumps());

        const mapLumpIndex = allLumps.findIndex((lump) => {
            return lump.name === mapLumpName;
        });
        if (mapLumpIndex === -1) {
            return;
        }

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

            yield lumpOfMap;
        };
    }

    private *_enumerateDoom2MapLumps(mapNr: number): Generator<Lump> {
        const mapLumpName = `MAP${mapNr.toString().padStart(2, '0')}`;

        const allLumps = Array.from(this.enumerateLumps());

        const mapLumpIndex = allLumps.findIndex((lump) => {
            return lump.name === mapLumpName;
        });
        if (mapLumpIndex === -1) {
            return;
        }

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

            yield lumpOfMap;
        };
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
     * Enumerates the THINGS elements, while handling this WAD file as DOOM.WAD
     *
     * @param {number} episodeNr The number of episode.
     * @param {number} mapNr The number of map inside `episode`.
     *
     * @returns {Generator<Thing>} The stream of `Thing`s
     */
    *enumerateThingsOfDoom1Map(episodeNr: number, mapNr: number): Generator<Thing> {
        const thingStream = this._enumerateThingsOfMap(
            new BufferStream(this._data),
            Array.from(this._enumerateDoom1MapLumps(episodeNr, mapNr))
        );

        for (const thing of Array.from(thingStream)) {
            yield thing;
        }
    }

    /**
     * Enumerates the THINGS elements, while handling this WAD file as DOOM2.WAD
     *
     * @param {number} mapNr The number of map inside `episode`.
     *
     * @returns {Generator<LineDefs>} The stream of `Thing`s
     */
    *enumerateThingsOfDoom2Map(mapNr: number): Generator<Thing> {
        const thingStream = this._enumerateThingsOfMap(
            new BufferStream(this._data),
            Array.from(this._enumerateDoom2MapLumps(mapNr))
        );

        for (const thing of Array.from(thingStream)) {
            yield thing;
        }
    }

    private *_enumerateThingsOfMap(
        stream: BufferStream,
        allLumpsOfMap: Lump[]
    ): Generator<Thing> {
        const thingsLump = allLumpsOfMap.find((lump) => {
            return lump.name.toUpperCase().trim() === "THINGS";
        });
        if (!thingsLump) {
            return;  // we need the `LINEDEFS` lump
        }

        // now extract the data ...
        stream.position = thingsLump.position;
        while (stream.position < thingsLump.position + thingsLump.size) {
            const newThing = Thing.fromBufferStream(
                stream
            );

            if (newThing) {
                yield newThing;
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
 * A "thing".
 */
export class Thing {
    private constructor() { }

    /**
     * The angle.
     */
    public angle!: number;

    /**
     * Gets the list of doom flag names.
     */
    public get doomFlagNames() {
        return this.doomFlags.map((flag) => {
            return DOOMThingFlags[flag];
        });
    }

    /**
     * Gets the list of doom flags.
     */
    public get doomFlags() {
        return Object.values(DOOMThingFlags).filter((value: any) => {
            return (this.flags & value) !== 0;
        }) as unknown as DOOMThingFlags[];
    }

    /**
     * Gets `type` as `DOOMThingType`, if possible.
     */
    public get doomType() {
        return (Object.values(DOOMThingType).find((value) => {
            return value === this.type;
        }) ?? null) as unknown as DOOMThingType | null;
    }

    /**
     * Gets the name of `doomType`, if possible.
     */
    public get doomTypeName() {
        const doomType = this.doomType;
        if (!doomType) {
            return null;
        }

        return DOOMThingType[doomType];
    }

    /**
     * The flags.
     */
    public flags!: number;

    /**
     * Creates a new instance from a `BufferStream`.
     *
     * @param {BufferStream} stream The stream.
     *
     * @returns {Thing|null} The new instance or `null` if EOF.
     */
    public static fromBufferStream(
        stream: BufferStream
    ): Thing | null {
        let temp: Buffer;

        temp = stream.read(2);
        if (temp.length !== 2) {
            return null;
        }

        const x = temp.readInt16LE();

        temp = stream.read(2);
        if (temp.length !== 2) {
            return null;
        }

        const y = temp.readInt16LE();

        temp = stream.read(2);
        if (temp.length !== 2) {
            return null;
        }

        const angle = temp.readInt16LE();

        temp = stream.read(2);
        if (temp.length !== 2) {
            return null;
        }

        const type = temp.readInt16LE();

        temp = stream.read(2);
        if (temp.length !== 2) {
            return null;
        }

        const flags = temp.readInt16LE();

        const newThing = new Thing();
        newThing.angle = angle;
        newThing.flags = flags;
        newThing.type = type;
        newThing.x = x;
        newThing.y = y;

        return newThing;
    }

    /**
     * @inheritdoc
     */
    toJSON() {
        return {
            angle: this.angle,
            doomFlagNames: this.doomFlagNames,
            doomFlags: this.doomFlags,
            doomType: this.doomType,
            doomTypeName: this.doomTypeName,
            flags: this.flags,
            type: this.type,
            x: this.x,
            y: this.y,
        };
    }

    /**
     * The type.
     */
    public type!: number;

    /**
     * The X coordinate.
     */
    public x!: number;

    /**
     * The Y coordicate.
     */
    public y!: number;
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
