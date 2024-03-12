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

import { LineDefs, Thing } from "@/types";
import axios from 'axios';
import _ from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

export default function Home() {
    const [episodeNr, setEpisodeNr] = useState('1');
    const [isLoadingLineDefs, setIsLoadingLineDefs] = useState(false);
    const [isLoadingThings, setIsLoadingThings] = useState(false);
    const [lineDefs, setLineDefs] = useState<LineDefs[]>([]);
    const [mapNr, setMapNr] = useState('1');
    const [offsetX, setOffsetX] = useState('500');
    const [offsetY, setOffsetY] = useState('200');
    const [scale, setScale] = useState('6');
    const [selectedThingIds, setSelectedThingIds] = useState<number[]>([]);
    const [things, setThings] = useState<Thing[]>([]);
    const [thingToShow, setThingToShow] = useState<Thing | null>(null);
    const [wadFile, setWadFile] = useState('doom2');
    const [windowHeight, setWindowHeight] = useState(0);

    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const canvasWrapperRef = React.useRef<HTMLDivElement>(null);
    const thingListRef = React.useRef<HTMLDivElement>(null);

    const thingsWithID = useMemo(() => {
        return _(things).map((thing, thingIndex) => {
            return {
                id: thingIndex,
                thing,
            };
        }).value();
    }, [things]);

    const selectedThingsWithIDs = useMemo(() => {
        return thingsWithID.filter(({
            id
        }) => {
            return selectedThingIds.includes(id);
        });
    }, [selectedThingIds, thingsWithID]);

    const areAllThingsSelected = useMemo(() => {
        return selectedThingsWithIDs.length > 0 &&
            selectedThingsWithIDs.length === thingsWithID.length;
    }, [selectedThingsWithIDs, thingsWithID]);

    const reloadLineDefs = useCallback(async () => {
        setIsLoadingLineDefs(true);

        try {
            const {
                data,
                status
            } = await axios.get<LineDefs[]>('/api/linedefs', {
                params: {
                    'e': episodeNr,
                    'm': mapNr,
                    'w': wadFile
                }
            });

            if (status !== 200) {
                throw new Error(`Unexpected response: ${status}`);
            }

            setLineDefs(data);
        } finally {
            setIsLoadingLineDefs(false);
        }
    }, [episodeNr, mapNr, wadFile]);

    const reloadThings = useCallback(async () => {
        setIsLoadingThings(true);

        try {
            const {
                data,
                status
            } = await axios.get<Thing[]>('/api/things', {
                params: {
                    'e': episodeNr,
                    'm': mapNr,
                    'w': wadFile
                }
            });

            if (status !== 200) {
                throw new Error(`Unexpected response: ${status}`);
            }

            setThings(data);
            setSelectedThingIds(
                data.map((thing, thingIndex) => {
                    return thingIndex;
                })
            );
        } finally {
            setIsLoadingThings(false);
        }
    }, [episodeNr, mapNr, wadFile]);

    const reloadMap = useCallback(async () => {
        setLineDefs([]);
        setThings([]);

        await reloadLineDefs();
        await reloadThings();
    }, [reloadLineDefs, reloadThings]);

    const handleDownloadImageClick = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const dataURL = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = dataURL;

        link.download = "image.png";
        if (wadFile === 'doom') {
            link.download = `${wadFile}-e${episodeNr}m${mapNr}.png`;
        } else if (wadFile === 'doom2') {
            link.download = `${wadFile}-map${mapNr}.png`;
        }

        link.click();

        setTimeout(() => {
            link.remove();
        }, 1500);
    }, [episodeNr, mapNr, wadFile]);

    const renderSelectAllThingsArea = useCallback(() => {
        return (
            <div>
                <input
                    type="checkbox"
                    checked={areAllThingsSelected}
                    onChange={() => {
                        const newList: number[] = [];

                        if (!areAllThingsSelected) {
                            newList.push(
                                ...thingsWithID.map(({
                                    id
                                }) => {
                                    return id;
                                })
                            );
                        }

                        setSelectedThingIds(newList);
                    }}
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Select all</label>
            </div>
        );
    }, [areAllThingsSelected, thingsWithID]);

    const renderThingList = useCallback(() => {
        return (
            <div>
                {_(thingsWithID)
                    .sortBy((t) => {
                        const {
                            id,
                            thing
                        } = t;

                        const thingName = String(thing.doomTypeName || thing.type);

                        return thingName.toLowerCase().trim();
                    })
                    .map((t) => {
                        const {
                            id,
                            thing
                        } = t;

                        const isThingSelected = selectedThingIds.includes(id);

                        const thingKey = `doom-map-thing-${id}`;

                        const thingName = String(thing.doomTypeName || thing.type);
                        const thingLabel = `${thingName} (${thing.x},${thing.y})`;

                        return (
                            <div
                                key={thingKey}
                                className="flex items-center my-2 mx-2"
                            >
                                <input
                                    type="checkbox"
                                    checked={isThingSelected}
                                    onChange={(() => {
                                        let newList: number[];
                                        if (isThingSelected) {
                                            newList = _(selectedThingIds)
                                                .filter((thingId) => {
                                                    return thingId !== id;
                                                })
                                                .value();
                                        } else {
                                            newList = [...selectedThingIds, id]
                                        }

                                        setSelectedThingIds(
                                            _(newList)
                                                .uniq()
                                                .value()
                                        );
                                    })}
                                    value=""
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label
                                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        setThingToShow(thing);
                                    }}
                                >
                                    {thingLabel}
                                </label>
                            </div>
                        );
                    })
                    .value()}
            </div>
        );
    }, [selectedThingIds, thingsWithID]);

    const renderMapSelector = useCallback(() => {
        if (wadFile === 'doom2') {
            return (
                <>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Map</label>
                    <select
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={mapNr}
                        onChange={(e) => {
                            setMapNr(e.target.value);
                        }}
                    >
                        {_.range(1, 33).map((nr) => {
                            return (
                                <option
                                    key={`map-${wadFile}-${nr}`}
                                    value={String(nr)}
                                >
                                    {String(nr)}
                                </option>
                            );
                        })}
                    </select>
                </>
            );
        }

        if (wadFile === 'doom') {
            return (
                <div
                    className="grid md:grid-cols-2 md:gap-6"
                >
                    <div className="relative z-0 w-full mb-5 group">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Episode</label>
                        <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            style={{
                                marginBottom: '1rem'
                            }}
                            value={mapNr}
                            onChange={(e) => {
                                setEpisodeNr(e.target.value);
                            }}
                        >
                            {_.range(1, 4).map((nr) => {
                                return (
                                    <option
                                        key={`episode-${wadFile}-${nr}`}
                                        value={String(nr)}
                                    >
                                        {String(nr)}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="relative z-0 w-full mb-5 group">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Map</label>
                        <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            value={mapNr}
                            onChange={(e) => {
                                setMapNr(e.target.value);
                            }}
                        >
                            {_.range(1, 10).map((nr) => {
                                return (
                                    <option
                                        key={`map-${wadFile}-${nr}`}
                                        value={String(nr)}
                                    >
                                        {String(nr)}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
            );
        }

        return null;
    }, [mapNr, wadFile]);

    const renderDialogs = useCallback(() => {
        const dialogs: React.ReactNode[] = [];

        if (thingToShow) {
            console.log(thingToShow);

            dialogs.push(
                <div
                    key="map-thing-details"
                    aria-hidden="false"
                    style={{
                        position: 'fixed',
                        left: '33%',
                        top: 'calc(25% - 100px)',
                    }}
                    className="overflow-y-auto overflow-x-hidden z-[1055] justify-center items-center w-full h-full md:inset-0 max-h-full"
                >
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Thing
                                </h3>

                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal"
                                    onClick={() => {
                                        setThingToShow(null);
                                    }}
                                >
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                </button>
                            </div>

                            <div
                                className="p-4 md:p-5 space-y-4 dark:text-white"
                                style={{
                                    overflowY: 'auto',
                                    height: '50%'
                                }}
                            >
                                <pre>{JSON.stringify(
                                    thingToShow, null, 2
                                )}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return dialogs;
    }, [thingToShow]);

    useEffect(() => {
        reloadMap().catch(console.error);
    }, [reloadMap]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        const offsetXValue = Number(offsetX.trim());
        const offsetYValue = Number(offsetY.trim());
        const scaleValue = Number(scale.trim());

        if (typeof canvasWrapperRef?.current?.offsetWidth === 'number') {
            canvas.width = canvasWrapperRef?.current?.offsetWidth as number;
        }
        if (typeof canvasWrapperRef?.current?.offsetHeight === 'number') {
            canvas.height = canvasWrapperRef?.current?.offsetHeight as number;
        }

        context.reset();

        context.strokeStyle = "red";

        if (scaleValue === 0) {
            return;
        }

        // draw lines of map
        for (let i = 0; i < lineDefs.length; i++) {
            const ld = lineDefs[i];

            context.beginPath();
            try {
                var x1 = ld.start.x / scaleValue + offsetXValue;
                var y1 = ld.start.y / scaleValue + offsetYValue;

                context.moveTo(x1, y1);

                var x2 = ld.end.x / scaleValue + offsetXValue;
                var y2 = ld.end.y / scaleValue + offsetYValue;

                context.lineTo(x2, y2);
            } finally {
                context.stroke();
            }
        }

        const boxLength = 24 / scaleValue;
        for (let i = 0; i < selectedThingsWithIDs.length; i++) {
            const {
                thing
            } = selectedThingsWithIDs[i];

            context.fillStyle = "yellow";

            context.beginPath();
            try {
                const startX = thing.x / scaleValue - boxLength / 2 + offsetXValue;
                const startY = thing.y / scaleValue - boxLength / 2 + offsetYValue;

                context.rect(startX, startY, boxLength, boxLength);
            } finally {
                context.fill();
            }
        }
    }, [lineDefs, offsetX, offsetY, scale, selectedThingsWithIDs]);

    useEffect(() => {
        const thingListDiv = thingListRef.current;
        if (!thingListDiv) {
            return;
        }

        thingListDiv.style.height = `calc(${windowHeight - thingListDiv.offsetTop}px - 1rem)`;
    }, [windowHeight]);

    useEffect(() => {
        const handler = (e: UIEvent) => {
            setWindowHeight(window?.innerHeight ?? 0);
        };

        setWindowHeight(window?.innerHeight ?? 0);

        window.addEventListener("resize", handler);

        return () => {
            window.removeEventListener("resize", handler);
        };
    }, []);

    return (
        <>
            <main>
                <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-128 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 dark:text-white">
                        <h2
                            className="text-4xl font-extrabold dark:text-white text-center"
                            style={{
                                marginBottom: '2rem'
                            }}
                        >DOOM MapViewer</h2>

                        <div
                            style={{
                                marginBottom: '1rem'
                            }}
                        >
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">WAD file</label>
                            <select
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={wadFile}
                                onChange={(e) => {
                                    setWadFile(e.target.value);
                                }}
                            >
                                <option value="doom">DOOM</option>
                                <option value="doom2">DOOM 2</option>
                            </select>
                        </div>

                        <div>
                            {renderMapSelector()}
                        </div>

                        <div
                            className="grid md:grid-cols-2 md:gap-6"
                            style={{
                                marginTop: '1rem'
                            }}
                        >
                            <div className="relative z-0 w-full mb-5 group">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Offset X
                                </label>
                                <input
                                    type="number"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={offsetX}
                                    onChange={(e) => {
                                        setOffsetX(e.target.value);
                                    }}
                                />
                            </div>

                            <div className="relative z-0 w-full mb-5 group">
                                <div
                                >
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Offset Y
                                    </label>
                                    <input
                                        type="number"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        value={offsetY}
                                        onChange={(e) => {
                                            setOffsetY(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                marginBottom: '1rem'
                            }}
                        >
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Scale
                            </label>
                            <input
                                type="number"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                value={scale}
                                onChange={(e) => {
                                    setScale(e.target.value);
                                }}
                            />
                        </div>

                        <div>
                            <button
                                type="button"
                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                onClick={handleDownloadImageClick}
                            >
                                Download image
                            </button>
                        </div>

                        <div
                            style={{
                                marginTop: '2rem'
                            }}
                        >
                            <h4
                                className="text-2xl font-extrabold dark:text-white text-center"

                            >Things</h4>
                        </div>

                        <div
                            style={{
                                marginTop: '1rem'
                            }}
                        >
                            {renderSelectAllThingsArea()}
                        </div>

                        <div
                            ref={thingListRef}
                            style={{
                                overflowY: 'scroll',
                                marginTop: '1rem',
                                border: '1px solid white',
                            }}
                        >
                            {renderThingList()}
                        </div>
                    </div>
                </aside>

                <div
                    className="sm:ml-64 bg-black"
                    style={{
                        height: 'calc(100vh)',
                        overflowX: 'hidden',
                    }}
                    ref={canvasWrapperRef}
                >
                    <canvas
                        ref={canvasRef}
                    />
                </div>

                {renderDialogs()}
            </main>
        </>
    );
}
