import { watch } from "node:fs";
import { exec } from "node:child_process";

const BUILD_DELAY_MS = 200;
const buildStates = {
  IDLE: "idle",
  BUILDING: "building",
  REBUILD: "rebuild",
};

class BuildWatcher {
  changedFiles: Set<string | Buffer | null> = new Set();
  timeout: NodeJS.Timeout | undefined;
  buildState = buildStates.IDLE;

  handleChange(eventType: string, filename: string | Buffer | null) {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
    this.changedFiles.add(filename);
    this.timeout = setTimeout(() => {
      console.log(`Changed files: ${Array.from(this.changedFiles)}`);
      this.changedFiles.clear();
      this.requestBuild();
    }, BUILD_DELAY_MS);
  }

  requestBuild() {
    if (
      this.buildState == buildStates.BUILDING ||
      this.buildState == buildStates.REBUILD
    ) {
      this.buildState = buildStates.REBUILD;
      return;
    }
    this.buildState = buildStates.BUILDING;
    exec("npm run build", (error, stdout, stderr) => {
      console.log(error, stdout, stderr);
      const oldBuildState = this.buildState;
      this.buildState = buildStates.IDLE;
      if (oldBuildState == buildStates.REBUILD) {
        this.requestBuild();
      }
    });
  }
}

const watcher = new BuildWatcher();
const changeHandler = watcher.handleChange.bind(watcher);
watch("./src/pages", { recursive: true }, changeHandler);
watch("./src/template", { recursive: true }, changeHandler);
console.log("Watcher mounted :)");
