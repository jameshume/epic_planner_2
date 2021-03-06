
const storyPointsIcon = (props) => (
    <svg width="1em" height="1em" viewBox="0 0 16 16"  fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <rect width="16" height="16" fill="none"/>
        <text x="3pt" y="10pt" className="small" style={{font: "bold 10pt sans-serif"}}>{props.points}</text>
    </svg>
);

export default storyPointsIcon;