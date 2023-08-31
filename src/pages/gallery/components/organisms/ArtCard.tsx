import { AiOutlineHeart, AiOutlineLike } from "react-icons/ai";
import { Link } from "react-router-dom";
import { userContext } from "../../../../global/provider/context/userContext";
import { useContext, useState } from "react";
import useModal from "../../../../global/hooks/useModal";
import SignInModal from "../../../../global/components/organisms/SignInModal";
import { loadStorage, saveStorage } from "../../../profile/utilities/storage";
import { ArtDataTypes } from "../../../../global/constants/types";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebase.config";

type ArtCardTypes = {
	data: ArtDataTypes
};
export default function ArtCard({ data }: ArtCardTypes) {
	const user = useContext(userContext);
	const { modal, openModal, closeModal } = useModal();

	const [liked , setLiked] = useState(data.likes.some(e => e == user?.uid));
	const [likes , setLikes] = useState(data.likes.length);

	const loaded = loadStorage("favorites") as ArtDataTypes[];
	const [favorite , setFavorite] = useState(loaded.some(e => e.id == data.id));


	const sendLike = () => {
		//No se puede dar like si no estamos registrados
		if(user == null){
			openModal();
			return;
		}
		//No se puede dar like si ya le dimos antes
		if(data.likes.some(e => e == user.uid) || liked)return;

		//Damos like por primera vez
		updateDoc(doc(db , "gallery" , data.id) , {
			likes : arrayUnion(user!.uid)
		})
		setLikes(likes + 1);
		setLiked(true);
	};

	//Agregar o quitar de este post de nuestros favoritos
	const toggleFavorite = () => {
		if(user == null){
			openModal();
			return;
		}
		if (favorite) {
			const loaded:ArtDataTypes[] = loadStorage("favorites");
			const orderFocus = loaded.findIndex(e => e.id == data.id);
			loaded.splice(orderFocus , 1);
			//
			saveStorage("favorites", loaded);
			setFavorite(false);
		} else {
			saveStorage("favorites", [...loadStorage("favorites") ?? [], data]);
			setFavorite(true);
		}
	};

	return (
		<>
			<article className="max-w-full">
				<img
					className="w-full aspect-square mb-4"
					src={data.url}
					alt={data.title}
					style={{ imageRendering: "pixelated" }}
				/>
				<div className="w-full flex gap-6 justify-between items-center">
					<div className="flex gap-2">
						<button
							className={`border-neutral-300 p-2 flex gap-2 items-center border rounded-lg text-lg active:scale-90 transition-transform ${liked ? "text-sky-500 border-sky-500" : "hover:text-sky-500 hover:border-sky-500"}`}
							onClick={sendLike}
						>
							<AiOutlineLike />
							<span className="text-sm hidden min-[450px]:block">
								{likes}
							</span>
						</button>
						<button
							className={`border-neutral-300 p-2 flex gap-2 items-center rounded-lg text-lg active:scale-90 transition-transform ${
								favorite
									? "text-white bg-red-500"
									: "hover:text-sky-500 hover:border-sky-500 border"
							}`}
							onClick={toggleFavorite}
						>
							<AiOutlineHeart />
						</button>
					</div>
					<Link
						to={`/profile/${data.uid}`}
						className="text-sm text-ellipsis whitespace-nowrap overflow-hidden hover:text-sky-500"
					>
						@{data.name}
					</Link>
				</div>
			</article>
			{modal && <SignInModal onClose={closeModal} />}
		</>
	);
}
