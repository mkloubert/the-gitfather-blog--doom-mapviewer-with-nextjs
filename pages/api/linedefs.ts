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

/// <reference path="../../index.d.ts" />

import { LineDefs, WADFileBase } from "@/types";
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "node:fs";
import path from "node:path";

const {
    readFile
} = fs.promises;

export default async function getLineDefs(
    request: NextApiRequest,
    response: NextApiResponse<any>,
) {
    const lineDefs: LineDefs[] = [];

    const wad = String(request.query?.['w'] || '').toLowerCase().trim() || "doom2";
    if (wad !== "") {
        let lineDefProvider: (() => Promise<LineDefs[]>) | undefined;

        if (wad === "doom") {
            // DOOM 1

            const episodeNr = Number(
                String(request.query?.['e'] || '').trim() || "1"
            );
            const mapNr = Number(
                String(request.query?.['m'] || '').trim() || "1"
            );

            lineDefProvider = async () => {
                const wadFileData = await readFile(
                    path.join(request.appRoot, '/wads/doom.wad')
                );

                const doom1wad = WADFileBase.fromBuffer(wadFileData);

                return Array.from(
                    doom1wad.enumerateLineDefsOfDoom1Map(episodeNr, mapNr)
                );
            };
        } else if (wad === "doom2") {
            // DOOM 2

            const mapNr = Number(
                String(request.query?.['m'] || '').trim() || "1"
            );

            lineDefProvider = async () => {
                const wadFileData = await readFile(
                    path.join(request.appRoot, '/wads/doom2.wad')
                );

                const doom2wad = WADFileBase.fromBuffer(wadFileData);

                return Array.from(
                    doom2wad.enumerateLineDefsOfDoom2Map(mapNr)
                );
            };
        }

        if (lineDefProvider) {
            lineDefs.push(
                ...(await lineDefProvider())
            );
        }
    }

    response.json(lineDefs);
}
