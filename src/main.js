import "./style.css"
import staticBackground from "./staticBackground"

document.querySelector("#app").innerHTML = `
<div>
 <section id="staticBackground">
    ${staticBackground()}
 </section>
</div>`

import "./weatherInfo.js"  // Add this AFTER DOM creation
import "./indicatorBlock.js"    // Enable weather indicators
import "./countryData.js"    // Enable weather indicators
import "./staticBackground.js"    // Enable weather indicators
import "./weatherInfoBlock.js"
import "./adviceInfo.js"