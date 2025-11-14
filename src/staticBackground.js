import "./style.css"


export default function() {
    return `
<div class="bg-black-20 min-h-screen min-w-screen flex flex-col items-center text-center text-light">
    <header class="bg-black-5 w-screen h-8">
        <h1 class="text-2xl text-white-100">WeatherNow</h1>
    </header>

    <main class="flex flex-col justify-start mt-4 gap-4 w-[98%] flex-1">
        <div>
            <input id="inputLocation"  type="text" class="mt-2 self-center  w-[90%] h-8 bg-black-5 text-white-100 pl-5.5 placeholder-white-70" placeholder="Search a city..."/>
        </div>


        <div class="flex flex-col self-center bg-black-15 w-[90%] rounded-2xl h-full" id="weather-container">

            <div class="flex text-white-100 h-[12%] rounded-t-2xl items-center justify-center w-full bg-black-5" id="location">
                Input a city
            </div>

            <div class="text-white-100 h-[8%] w-full bg-black-10" id="navInfo">navInfo</div>

            <!-- Weather Info Grid -->
            <div class="grid grid-cols-2 grid-rows-[32%_68%] self-center w-[96%] mt-2 h-100 gap-2" id="weather-info-container">

                <!-- Left top -->
                <div class="text-white-100 rounded-2xl bg-black-40 flex flex-col items-center justify-center p-2"
                id="indicator-icon">
                </div>

                <!-- Right top -->
                <div class="text-white-100 rounded-2xl bg-black-40 flex flex-col items-center justify-center p-2"
                id="country-location-info">
                </div>

                <!-- Bottom full width -->
                <div class="flex flex-col gap-2 text-white-100 rounded-2xl bg-black-40 items-center justify-center p-2 h-[94%] col-span-2"
                >
                    <div class="pt-3 flex h-12 w-full bg-black-30 rounded-2xl justify-center items-center text-sm overflow-y-auto" id="advice-info"></div>
                    <div class="p-3 overflow-y-auto w-[95.4%] h-[84%] text-white-100 text-sm " id="weather-location-info"></div>
                </div>
            </div>
        </div>
            
    </main>

    <footer class="w-screen mt-2 bg-black-5 h-6 text-white-100">Nyro The Best</footer>
</div>
`
}

