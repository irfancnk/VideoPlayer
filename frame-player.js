/**
 * Author :  Irfan Can Kaleli
 */
const VIDEO_PLAYER_ID = "videoPlayer";
const IMAGE_BASE_URL = "http://storage.googleapis.com/alyo/assignments/images/";
const PLAYER_WIDTH = 640;
const PLAYER_HEIGHT = 360;
const IMAGE_WIDTH = 128;
const IMAGE_HEIGHT = 72;
const VIDEO_DURATION = 18;
const FRAME_PER_SECOND = 10;
const PROGRESS_UNIT = 100 / (VIDEO_DURATION * FRAME_PER_SECOND);
var IS_PLAYING = true;


/**
 * FramePlayer class is used for fragmentation and serialization
 * of given images.
 * FramePlayer object is designed for instantiating after the
 * DOM elements of used HTML is loaded.
 */
class FramePlayer {
    /**
     * Represents a FramePlayer.
     * @constructor
     * @param {string} id - The id of the canvas used for rendering.
     */
    constructor(id) {
        this.videoPlayerContext = document.getElementById(id).getContext("2d");
        this.videoProgressBarElement = document.getElementById("progressBar");
        this.currentImageUrlNumber = 0;
        this.currentImageFrameNumber = 0;
        this.imageLoadingTimer = null;
        this.videoPlayInterval = null;
        this.progressBarWidth = 1;
        this.imageObject = this.createCurrentImageObject();
    }

    /**
     * Creates the source URL of the image that needs to be shown
     */
    createCurrentImageSource() {
        return IMAGE_BASE_URL + this.currentImageUrlNumber + ".jpg"
    }

    /**
     * Creates the image object with current URL of object
     * @returns {Object} Image object with added URL source
     */
    createCurrentImageObject() {
        var imageObject = new Image();
        imageObject.src = this.createCurrentImageSource();
        return imageObject;
    }

    /**
     * Starts the video playing after ensuring image is loaded
     * Starts the progress bar
     */
    start() {
        this.imageObject = this.createCurrentImageObject();
        this.imageObject.onLoad = this.imageLoaded();
    }

    /**
     * Pauses the video and progress bar
     */
    pause() {
        clearInterval(this.videoPlayInterval);
    }


    /**
     * Returns the coordinates of the current frame in the image
     * @returns {Array} Array with X and Y coordinates
     */
    getFrameCoordinates() {
        var coordinates = [];
        coordinates.push((this.currentImageFrameNumber % 5) * 128);
        coordinates.push(Math.floor(this.currentImageFrameNumber / 5) * 72);
        return coordinates;
    }


    /**
     * Waits for a 3ms of timeout recursively for image to be loaded
     */
    imageLoaded() {

        var self = this;
        if (this.imageLoadingTimer != null) {
            clearTimeout(this.imageLoadingTimer);
        }
        if (!this.imageObject.complete) {
            this.imageLoadingTimer = setTimeout(function() {
                self.imageLoaded();
            }, 3);
        } else {
            this.controlVideoPlay();
        }
    }


    /**
     * Calls rendering to show current frame to the user
     * Calculates the next frame and replays if all images and frames are
     * shown
     * Adjusts progress bar to show time
     */
    controlVideoPlay() {
        var self = this;
        self.videoPlayInterval = setInterval(function() {
            self.renderFrame();

            self.progressBarWidth = self.progressBarWidth + PROGRESS_UNIT;
            self.videoProgressBarElement.style.width = self.progressBarWidth + '%';

            self.currentImageFrameNumber = self.currentImageFrameNumber + 1;
            if (self.currentImageFrameNumber > 24) {
                clearInterval(self.videoPlayInterval);
                self.currentImageUrlNumber = self.currentImageUrlNumber + 1;
                self.currentImageFrameNumber = 0;
                if (self.currentImageUrlNumber > 6) {
                    self.currentImageUrlNumber = 0;
                    self.progressBarWidth = 0;
                }
                self.start();
            }
        }, 100);


    }

    /**
     * Renders the current frame to the given canvas with plain
     * JavaScript drawImage method
     */
    renderFrame() {
        var coord = this.getFrameCoordinates();
        this.videoPlayerContext.drawImage(this.imageObject, coord[0], coord[1], IMAGE_WIDTH, IMAGE_HEIGHT, 0, 0, PLAYER_WIDTH, PLAYER_HEIGHT);
    }




}



window.onload = function() {


    var player = new FramePlayer(VIDEO_PLAYER_ID);
    player.start();

    function alteringStartStop() {
        if (IS_PLAYING) {
            player.pause();
            document.getElementById("playButton").innerHTML = "Play";
        } else {
            player.start();
            document.getElementById("playButton").innerHTML = "Stop";
        }
        IS_PLAYING = !IS_PLAYING;
    }

    document.getElementById("playButton").addEventListener("click", function() {
        alteringStartStop();
    });

    document.getElementById("videoPlayer").addEventListener("click", function() {
        alteringStartStop();
    });

    document.getElementById("progressBar").addEventListener("click", function() {
        alteringStartStop();
    });

    document.getElementById("progressStatus").addEventListener("click", function() {
        alteringStartStop();
    });







}
