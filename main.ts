// baseline-snooze-button
// © 2024 Nathan Galt
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, version 3.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import YAML from "npm:yaml@2.6.0";

const zip = (a: string[], b: string[]) => a.map((k, i) => [k, b[i]]);

interface Info {
  name: string;
  description: string;
  baseline: "low" | "high" | undefined;
  baseline_low_date: string | undefined;
  baseline_high_date: string | undefined;
}

const sources: string[] = [];
const dists: string[] = [];
const outs: Info[] = [];

for await (const entry of Deno.readDir("web-features/features")) {
  if (entry.isDirectory) continue;
  if (entry.name.endsWith(".yml.dist")) {
    dists.push(entry.name);
  } else if (entry.name.endsWith(".yml")) {
    sources.push(entry.name);
  } else {
    console.warn(`weird filename: ${entry.name}`);
  }
}

sources.sort();
dists.sort();

console.log(`sources: ${sources.length}`);
console.log(`dists:   ${dists.length}`);

for (const [source, dist] of zip(sources, dists)) {
  if (!dist.startsWith(source)) {
    throw new Error(`source ${source} does not match dist ${dist}`);
  }

  const sourceContents = Deno.readTextFileSync(
    `web-features/features/${source}`
  );
  const distContents = Deno.readTextFileSync(`web-features/features/${dist}`);

  const sourceYaml = YAML.parse(sourceContents);
  const distYaml = YAML.parse(distContents);

  const status = { ...sourceYaml?.status, ...distYaml?.status };

  const out: Info = {
    name: sourceYaml.name as string,
    description: sourceYaml.description as string,
    baseline: status.baseline as "low" | "high" | undefined,
    baseline_low_date: status.baseline_low_date as string | undefined,
    baseline_high_date: status.baseline_high_date as string | undefined,
  };

  outs.push(out);
}

const highs = structuredClone(outs).filter((out) => !!out.baseline_high_date);
const lows = structuredClone(outs).filter((out) => !!out.baseline_low_date);

highs.sort((lhs, rhs) => {
  return ("" + lhs.baseline_high_date).localeCompare(
    rhs.baseline_high_date as string
  );
});

lows.sort((lhs, rhs) => {
  return ("" + lhs.baseline_low_date).localeCompare(
    rhs.baseline_low_date as string
  );
});

for (const i of highs) {
  delete i.baseline;
  delete i.baseline_low_date;
}

for (const i of lows) {
  delete i.baseline;
  delete i.baseline_high_date;
}

let output = YAML.stringify(lows);
output = output.replaceAll("\n-", "\n\n-");

console.log(output);
