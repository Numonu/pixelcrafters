import Wrapper from "../../global/components/atoms/Wrapper";
import DrawCanvas from "./components/molecules/DrawCanvas";
import GuideCanvas from "./components/molecules/GuideCanvas";
import DrawToolBar from "./components/organisms/DrawToolBar";
import DrawOptions from "./components/organisms/DrawOptions";
import DrawProvider from "./providers/DrawProvider";

export default function Create() {
	return (
		<Wrapper>
			<header className="text-center mt-4 mb-16 lg:mb-14">
				<h2 className="text-black mb-2 text-xl font-medium">
					New Pixelart
				</h2>
				<h1 className="text-base font-normal">
					Create a new pixelart and contribute to Pixelcrafters
					collection
				</h1>
			</header>
			<main className="max-w-[500px] mx-auto grid pb-12 gap-4 grid-cols-1 lg:max-w-none lg:grid-cols-[1fr_500px_1fr]">
				<DrawProvider>
					<section className="flex justify-center lg:justify-end lg:-order-1 lg:mx-0">
						<DrawToolBar />
					</section>
					<section className="relative aspect-square">
						<GuideCanvas/>
						<DrawCanvas/>
					</section>
					<section>
						<div className="border-neutral-300 w-min min-w-[200px] h-full p-2 rounded-md border">
							<DrawOptions/>
						</div>
					</section>
				</DrawProvider>
			</main>
		</Wrapper>
	);
}
