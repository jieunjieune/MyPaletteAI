import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { paletteDetailApi, deletePalette } from "../../apis/PaletteAPICalls";
import { savePaletteApi, deleteSavePaletteApi, getSavePalettesApi } from "../../apis/SaveAPICalls";
import DetailCSS from "./PaletteDetail.module.css";
import { useLoginInfo } from "../../hooks/useLoginInfo";
import { FaRegBookmark, FaBookmark, FaShareAlt } from "react-icons/fa";
import html2canvas from "html2canvas";
import { MdDownload } from "react-icons/md";

export default function PaletteDetail() {
	const { id } = useParams();
	const dispatch = useDispatch();
	const { userId } = useLoginInfo();

	const palette = useSelector((state) => state.paletteReducer.detail);
	// const savingState = useSelector((state) => state.paletteReducer.saving);
	const saveResult = useSelector((state) => state.paletteReducer.saveResult);
	const savedPalettes = useSelector((state) => state.saveReducer.list || []);

	const [loading, setLoading] = useState(true);
	const [copied, setCopied] = useState("");
	const [savedId, setSavedId] = useState(null);
	const [shareMessage, setShareMessage] = useState("");

	const paletteRef = useRef(null); // 이미지 캡쳐용

	// 상세 + 저장된 팔레트 조회
	useEffect(() => {
		const fetchData = async () => {
			try {
				await dispatch(paletteDetailApi(id));
				if (userId) await dispatch(getSavePalettesApi());
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [dispatch, id, userId]);

	// 저장 여부 확인
	useEffect(() => {
		if (userId && savedPalettes.length > 0) {
			const existing = savedPalettes.find((p) => p.paletteId === parseInt(id));
			if (existing) setSavedId(existing.saveId);
		}
	}, [savedPalettes, id, userId]);

	const handleCopyColor = (color) => {
		navigator.clipboard.writeText(color);
		setCopied(color);
		setTimeout(() => setCopied(""), 1500);
	};

	const handleSave = async () => {
		const result = await dispatch(savePaletteApi(id));
		if (result?.savedPalette?.saveId) setSavedId(result.savedPalette.saveId);
		alert("팔레트를 저장했습니다 ( ˶'ᵕ'🫶)💕");
	};

	const handleUnSave = async () => {
		if (!savedId) return;
		await dispatch(deleteSavePaletteApi(savedId));
		setSavedId(null);
	};

	// URL 공유
	const handleShareURL = () => {
		const url = window.location.href;
		navigator.clipboard.writeText(url);
		setShareMessage("URL이 복사되었습니다! 🌈");
		setTimeout(() => setShareMessage(""), 2000);
	};

	// 이미지 다운로드 (로그인 시만 가능)
	const handleDownloadImage = async () => {
		if (!userId) {
			setShareMessage("로그인 후 다운로드가 가능합니다 🎨");
			setTimeout(() => setShareMessage(""), 2000);
			return;
		}

		// 확인창
		const confirmed = window.confirm("해당 팔레트를 .png로 다운로드 받으시겠습니까?");
		if (!confirmed) return;

		if (!paletteRef.current) return;
		try {
			const canvas = await html2canvas(paletteRef.current, { 
				backgroundColor: "#ffffff",
				scale: 1.2,
			});
			const dataURL = canvas.toDataURL("image/png");
			const link = document.createElement("a");
			link.href = dataURL;
			link.download = `${palette.title}.png`;
			link.click();
		} catch (error) {
			console.error("이미지 다운로드 실패:", error);
		}
	};

	const handlePaletteDelete = async () => {
		const confirmed = window.confirm("정말 이 팔레트를 삭제하시겠습니까?");
		if (!confirmed) return;
	
		try {
			await deletePalette(id);
	
			alert("팔레트가 삭제되었습니다 🗑️");
	
			window.location.href = "/";
	
		} catch (error) {
			console.error("팔레트 삭제 실패", error);
			alert("삭제에 실패했습니다 😢");
		}
	};

	if (loading) return <div className={DetailCSS.loading}>불러오는 중...</div>;
	if (!palette) return <div className={DetailCSS.error}>팔레트를 찾을 수 없습니다.</div>;

	return (
		<div className={DetailCSS.container}>
			{/* 이미지 캡처 영역: 컬러칩 + 제목 + 무드 */}
			<div className={DetailCSS.paletteExportArea} ref={paletteRef}>
				<div className={DetailCSS.colorBar}>
					{palette.recommendedColors?.map((color, idx) => (
						<div key={idx} className={DetailCSS.colorItem}>
							<div
								className={DetailCSS.colorBlock}
								style={{ backgroundColor: color }}
							/>
							<div
								className={DetailCSS.colorName}
								onClick={() => handleCopyColor(color)}
							>
								{color}
								{copied === color && <span className={DetailCSS.copied}>복사✨</span>}
							</div>
						</div>
					))}
				</div>
			</div>
				<div className={DetailCSS.info}>
					<h2 className={DetailCSS.title}>{palette.title}</h2>
					<p className={DetailCSS.mood}>{palette.mood}</p>
				</div>

			{/* 버튼 영역: URL 공유 → 다운로드 → 북마크 */}
			<div className={DetailCSS.actionButtons}>
				<FaShareAlt
					className={DetailCSS.shareIcon}
					onClick={handleShareURL}
					title="URL 공유"
				/>
				<MdDownload
					className={DetailCSS.downloadIcon}
					onClick={handleDownloadImage}
					title="이미지 다운로드"
				/>
				{userId && (
					!savedId ? (
						<FaRegBookmark
							className={DetailCSS.bookmarkIcon}
							onClick={handleSave}
							title="저장하기"
						/>
					) : (
						<FaBookmark
							className={DetailCSS.bookmarkIconFilled}
							onClick={handleUnSave}
							title="삭제하기"
						/>
					)
				)}
				{userId === palette.paletteCreatedBy && (
					<button onClick={handlePaletteDelete}>
						삭제하기 🗑️
					</button>
				)}
			</div>

			{/* 메시지 */}
			{saveResult?.message && <div className={DetailCSS.saveMessage}>{saveResult.message}</div>}
			{shareMessage && <div className={DetailCSS.saveMessage}>{shareMessage}</div>}
		</div>
	);
}