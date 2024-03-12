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

import type { LineDefs } from "@/types";
import axios from 'axios';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

export default function Home() {
    const [episodeNr, setEpisodeNr] = useState('1');
    const [isLoadingLineDefs, setIsLoadingLineDefs] = useState(false);
    const [lineDefs, setLineDefs] = useState<LineDefs[]>([]);
    const [mapNr, setMapNr] = useState('1');
    const [offsetX, setOffsetX] = useState('500');
    const [offsetY, setOffsetY] = useState('200');
    const [scale, setScale] = useState('6');
    const [wadFile, setWadFile] = useState('doom2');

    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const canvasWrapperRef = React.useRef<HTMLDivElement>(null);

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
                <>
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
                </>
            );
        }

        return null;
    }, [mapNr, wadFile]);

    useEffect(() => {
        reloadLineDefs().catch(console.error);
    }, [reloadLineDefs]);

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

        if (scaleValue !== 0) {
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
        }
    }, [isLoadingLineDefs, lineDefs, offsetX, offsetY, scale]);

    return (
        <main>
            <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
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

                    <div
                        style={{
                            marginBottom: '1rem'
                        }}
                    >
                        {renderMapSelector()}
                    </div>

                    <div
                        style={{
                            marginBottom: '1rem'
                        }}
                    >
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

                    <div
                        style={{
                            marginBottom: '1rem'
                        }}
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
                </div>
            </aside>

            <div
                className="p-4 sm:ml-64"
                style={{
                    height: 'calc(100vh - 5rem)',
                    overflowX: 'hidden',
                }}
                ref={canvasWrapperRef}
            >
                <canvas
                    ref={canvasRef}
                />
            </div>
        </main>
    );
}
