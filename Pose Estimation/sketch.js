let capture;
let posenet;
let singlePose, skeleton;
let actor_img;

function preload() {
    // Load the image and provide callbacks for success and error
    actor_img = loadImage('path/to/your/image.png', img => {
        console.log('Image loaded successfully');
        alert('Image loaded successfully!'); // Alert when the image is loaded
    }, err => {
        console.error('Error loading image:', err);
        alert('Error loading image: ' + err); // Alert if there is an error loading the image
    });
}

function setup() {
    createCanvas(1100, 800); // Set canvas size
    capture = createCapture(VIDEO);
    capture.size(800, 600); // Reduce the resolution
    capture.hide();

    posenet = ml5.poseNet(capture, modelLoaded);
    posenet.on('pose', receivedPoses);
    frameRate(900); // Set a lower frame rate
}
function receivedPoses(poses) {
    if (poses.length > 0) {
        singlePose = poses[0].pose;
        skeleton = poses[0].skeleton; // Update skeleton data
    }
}

function modelLoaded() {
    console.log('Model has loaded');
    alert('PoseNet model has loaded successfully!'); // Alert when the model is loaded
}

function draw() {
    image(capture, 0, 0, 800, 600);
    fill(255, 0, 0); // Keypoint color

    if (singlePose) {
        // Draw keypoints
        for (let i = 0; i < singlePose.keypoints.length; i++) {
            if (singlePose.keypoints[i].score > 0.5) { // Only draw keypoints with high confidence
                ellipse(singlePose.keypoints[i].position.x, singlePose.keypoints[i].position.y, 20);
            }
        }

        // Draw skeleton
        stroke(255, 255, 255); // Skeleton line color
        strokeWeight(4);
        for (let j = 0; j < skeleton.length; j++) {
            let partA = skeleton[j][0];
            let partB = skeleton[j][1];
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }

        // Draw actor image at the nose position
        let nose = singlePose.keypoints.find(k => k.part === 'nose');
        if (nose && nose.score > 0.5) { // Check if the nose keypoint is detected
            image(actor_img, nose.position.x - 45, nose.position.y - 60, 100, 100);
        }
    }
}