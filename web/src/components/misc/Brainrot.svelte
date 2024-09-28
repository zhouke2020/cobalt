<script lang="ts">
    import IconSpray from '@tabler/icons-svelte/IconSpray.svelte';
    import '@fontsource/luckiest-guy';
    import { onMount } from 'svelte';

    let renderVideo = false;
    let showVideo = false;
    let videoElement: HTMLVideoElement | undefined;
    let bounce = false;
    let context: AudioContext | undefined;
    let textDisplayed = "";

    onMount(() => {
        context = new AudioContext();
    });

    const prepareVideo = () => {
        renderVideo = true;
    }

    const animate = (text: string) => {
        bounce = false;
        setTimeout(() => {
            bounce = true;
            textDisplayed = text;
        }, 150);
    }

    const readOutLoud = (text: string) => {
        function fromBinary(encoded: string) {
            const binary = atob(encoded);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < bytes.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return bytes.buffer;
        }

        return new Promise<void>((resolve, reject) => {
            fetch('https://countik.com/api/text/speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    text,
                    voice: 'en_us_006'
                })
            }).then(a => a.json()).then(x => {
                const data = fromBinary(x.v_data);
                const source = context!.createBufferSource();
                context!.decodeAudioData(data, function(buffer) {
                    source.buffer = buffer;
                    source.connect(context!.destination);
                    source.start(0);
                    source.onended = () => resolve();

                    let sentences = text.match(/[^\.!\?]+[\.!\?]+/g);
                    if (!sentences) sentences = [text];

                    const maxTime = buffer.duration * 1000;
                    const totalLength = sentences.join(' ').length;
                    let totalTime = 0;
                    for (let i = 0; i < sentences.length; ++i) {
                        for (const word of sentences[i].split(' ')) {
                            const wordProportion = word.length / totalLength;
                            let wordReadTime = maxTime * wordProportion;
                            if (word.endsWith(',') || word.endsWith('.') || word.endsWith('!')) {
                                wordReadTime += 250;
                            }

                            setTimeout(() => animate(word), totalTime);
                            totalTime += wordReadTime;
                        }
                    }
                });

            }).catch(reject);
        });
    }

    $: {
        if (videoElement) {
            videoElement.addEventListener('canplaythrough', () => {
                showVideo = true;
                const sentences = [...document.querySelectorAll('section')]
                                    .map(a => a.textContent!
                                               .replace(/    /g, '\n')
                                               .split('\n')
                                               .filter(a => a)
                                        ).flat();

                let p = Promise.resolve();
                for (const sentence of sentences) {
                    p = p.then(() => readOutLoud(sentence));
                }
                videoElement?.play();
            }, { once: true });
        }
    }
</script>

<div id="brainrot-container">
    <button id="brainrot-button" on:click={prepareVideo} class:hidden={showVideo}>
        <IconSpray />
    </button>
    {#if renderVideo}
        <div id="brainrot-video" class:displayed={showVideo}>
            <div id="brainrot-text" class:animate={bounce}>
                { textDisplayed }
            </div>
            <!-- svelte-ignore a11y-media-has-caption -->
            <video
                bind:this={videoElement}
                src="/brainrot.mp4"
                loop
            ></video>
        </div>
    {/if}
</div>

<style>
    #brainrot-container {
        position: fixed;
        top: 32px;
        right: 32px;
        font-size: 60px;
    }

    #brainrot-button.hidden {
        display: none;
    }

    #brainrot-button {
        aspect-ratio: 1 / 1;
    }

    #brainrot-video {
        display: none;
        position: relative;
    }

    #brainrot-text {
        font-family: 'Luckiest Guy', cursive;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        width: 100%;
        text-align: center;
        --stroke-color: red;
        text-shadow: var(--stroke-color) 3px 0px 0px,
                     var(--stroke-color) 2.83487px 0.981584px 0px,
                     var(--stroke-color) 2.35766px 1.85511px 0px,
                     var(--stroke-color) 1.62091px 2.52441px 0px,
                     var(--stroke-color) 0.705713px 2.91581px 0px,
                     var(--stroke-color) -0.287171px 2.98622px 0px,
                     var(--stroke-color) -1.24844px 2.72789px 0px,
                     var(--stroke-color) -2.07227px 2.16926px 0px,
                     var(--stroke-color) -2.66798px 1.37182px 0px,
                     var(--stroke-color) -2.96998px 0.42336px 0px,
                     var(--stroke-color) -2.94502px -0.571704px 0px,
                     var(--stroke-color) -2.59586px -1.50383px 0px,
                     var(--stroke-color) -1.96093px -2.27041px 0px,
                     var(--stroke-color) -1.11013px -2.78704px 0px,
                     var(--stroke-color) -0.137119px -2.99686px 0px,
                     var(--stroke-color) 0.850987px -2.87677px 0px,
                     var(--stroke-color) 1.74541px -2.43999px 0px,
                     var(--stroke-color) 2.44769px -1.73459px 0px,
                     var(--stroke-color) 2.88051px -0.838247px 0px;
    }

    .animate {
        animation: bounce .1s ease-out;
    }

    @keyframes bounce {
        from {
            font-size: 72px;
        }

        to {
            font-size: inherit;
        }
    }

    #brainrot-video.displayed {
        display: block;
    }
</style>
