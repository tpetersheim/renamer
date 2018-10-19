import fs = require('fs');
// import path = require('path');
import yargs from 'yargs';
import { Logger } from './Logger';
// import { nameof } from './nameof';

class Main {

  private logger: Logger;

  private strippedNames: {} = {};

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public run() {
    const args = yargs.argv;
    // const fileRenamesJsonArg = args.fileRenames || './data/test.json';
    const fileRenamesArg = args.fileRenames || '';
    const episodesJsonArg = args.fileRenames || '';
    const folderNameArg = args.folder || '';

    const episodeResponse = this.readEpisodeResponse(episodesJsonArg);
    //const fileRenames = this.readVolCsv(fileRenamesArg);

    const existingFileNames = fs.readdirSync(folderNameArg);
    //this.logger.log(JSON.stringify(existingFileNames));

    const fileMatchesNotFound = [];

    existingFileNames.forEach((fileName: string, index: number) => {
      this.logger.log(fileName, index);

      const notFoundFile = this.renameFromEpisodeJson(fileName, episodeResponse, folderNameArg);
      //const notFoundFile = this.renameFromVolEpisodes(fileName, fileRenames, episodeResponse.data, folderNameArg);
      if (notFoundFile != null) {
        fileMatchesNotFound.push(notFoundFile);
      }

    });

    this.logger.log(`FAILURES ${fileMatchesNotFound.length}: ${JSON.stringify(fileMatchesNotFound, null)}`);
  }

  private renameFromVolEpisodes(fileName: string, fileRenames: VolEpisode[], episodes: Episode[], folderBasePath: string): string {

    if (fileName.length > 4 && fileName[4] !== 'x' && fileName[1] !== 'x') {

      const episodeNumber = fileName.substring(14, 16);
      const volEpisode = fileRenames.filter((x: VolEpisode) => x.id === parseInt(episodeNumber, 10));
      const volEpisodeName = volEpisode[0].name;

      let strippedEpisodeName = this.strippedNames[volEpisodeName];
      if (strippedEpisodeName == null) {
        strippedEpisodeName = this.strippedNames[volEpisodeName] = this.stripFileName(volEpisodeName);
      }

      let foundMatch = false;

      for (const e of episodes) {
        let strippedPotentialName = this.strippedNames[e.episodeName];
        if (strippedPotentialName == null) {
          strippedPotentialName = this.strippedNames[e.episodeName] = this.stripFileName(e.episodeName);
        }

        //this.logger.log(`File name: ${fileNameToRename}: ${strippedExistingFileName} -- Potential episode name: ${e.episodeName}: ${strippedPotentialName}`);
        if (strippedEpisodeName.indexOf(strippedPotentialName) > -1) {
          foundMatch = true;
          let newFileName = `${e.airedSeason}x${e.airedEpisodeNumber} - ${e.episodeName}`;
          newFileName = newFileName.replace('?', '').replace(':', '');
          this.logger.log(`Found match for ${fileName}: ${newFileName}`);

          const extension = fileName.split('.').pop();
          const oldFilePath = `${folderBasePath}\\${fileName}`;
          const newFilePath = `${folderBasePath}\\${newFileName}.${extension}`;

          this.logger.log(`old: ${oldFilePath}`);
          this.logger.log(`new: ${newFilePath}`);

          //fs.renameSync(oldFilePath, newFilePath);

          return null;
        }
      }

      if (!foundMatch) {
        this.logger.log(`FAILED to find match for ${fileName}: ${strippedEpisodeName}`);
        return fileName;
      }
    }

    return null;
  }

  private renameFromEpisodeJson(fileName: string, fileRenames: EpisodeResponse, folderBasePath: string): string {

    if (fileName.length > 4 && fileName[4] !== 'x' && fileName[1] !== 'x') {

      let strippedFileName = this.strippedNames[fileName];
      if (strippedFileName == null) {
        strippedFileName = this.strippedNames[fileName] = this.stripFileName(fileName);
      }

      let foundMatch = false;

      for (const e of fileRenames.data) {
        let strippedPotentialName = this.strippedNames[e.episodeName];
        if (strippedPotentialName == null) {
          strippedPotentialName = this.strippedNames[e.episodeName] = this.stripFileName(e.episodeName);
        }

        //this.logger.log(`File name: ${fileNameToRename}: ${strippedExistingFileName} -- Potential episode name: ${e.episodeName}: ${strippedPotentialName}`);
        if (strippedFileName.indexOf(strippedPotentialName) > -1) {
          foundMatch = true;
          let newFileName = `${e.airedSeason}x${e.airedEpisodeNumber} - ${e.episodeName}`;
          newFileName = newFileName.replace('?', '').replace(':', '');
          this.logger.log(`Found match for ${fileName}: ${newFileName}`);

          const extension = fileName.split('.').pop();
          const oldFilePath = `${folderBasePath}\\${fileName}`;
          const newFilePath = `${folderBasePath}\\${newFileName}.${extension}`;

          this.logger.log(`old: ${oldFilePath}`);
          this.logger.log(`new: ${newFilePath}`);

          fs.renameSync(oldFilePath, newFilePath);

          return null;
        }
      }

      if (!foundMatch) {
        this.logger.log(`FAILED to find match for ${fileName}: ${strippedFileName}`);
        return fileName;
      }
    }

    return null;
  }

  private stripFileName(fileName: string): string {
    const stripped = fileName
      .toLowerCase()

      .split(' ')
      .filter(x => x !== 'and')
      .filter(x => x !== '&')
      .filter(x => x !== 'a')
      .filter(x => x !== 'the')
      .join()

      .replace(/:/g, '')
      .replace(/,/g, '')
      .replace(/\./g, '')
      .replace(/-/g, '')
      .replace(/'/g, '')
      .replace(/\?/g, '')
      .replace(/!/g, '');

    return stripped;
  }

  private readVolCsv(filePath: string): VolEpisode[] {
    const fileRenames = fs.readFileSync(filePath).toString().split('\r\n');

    return fileRenames.map((x: string) => {
      const ep = x.split(',');
      return { id: parseInt(ep[0], 10), name: ep[1], year: parseInt(ep[2], 10) };
    });
  }

  private readEpisodeResponse(filePath: string): EpisodeResponse {
    const fileRenames: EpisodeResponse = JSON.parse(fs.readFileSync(filePath).toString());
    fileRenames.data = fileRenames.data.sort(this.sortEpisodes);
    //this.logger.log(JSON.stringify(fileRenames.data.map(x => `${x.airedSeason}-${x.airedEpisodeNumber}`), null, 2));
    return fileRenames;
  }

  private sortEpisodes(a: Episode, b: Episode) {
    const aAiredSeason = a.airedSeason;
    const bAiredSeason = b.airedSeason;
    const aAiredEpisodeNumber = a.airedEpisodeNumber;
    const bAiredEpisodeNumber = b.airedEpisodeNumber;

    return aAiredSeason < bAiredSeason
      ? -1
      : aAiredSeason > bAiredSeason
        ? 1
        : aAiredEpisodeNumber < bAiredEpisodeNumber
          ? -1
          : aAiredEpisodeNumber > bAiredEpisodeNumber
            ? 1
            : 0;
  }
}

new Main(new Logger()).run();

interface EpisodeResponse {
  data: Episode[];
}

interface Episode {
  id: number;
  airedSeason: number;
  airedSeasonID: number;
  airedEpisodeNumber: number;
  episodeName: string;
}

interface VolEpisode {
  id: number;
  name: string;
  year: number;
}
