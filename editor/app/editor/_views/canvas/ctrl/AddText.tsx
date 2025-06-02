"use client";;
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import {
	canvasTitleStyle,
	canvasTitle2Style,
	canvasSubtitleStyle,
	canvasBodyStyle,
	canvasCaptionStyle,
} from "../../../_utils/addTextStyles";
import { useCanvasEditorStore } from "@/app/editor/_utils/zustand/konva/impl";
import { DTextProps } from "@/app/editor/_utils/zustand/konva/store";

type Props = {
	children?: React.ReactNode;
	className?: string;
};

function X_Wrapper({
	children,
	onClick,
}: {
	children?: React.ReactNode;
	onClick?: () => void;
}) {
	return (
		<div
			className="border w-full p-1 hover:border-primary hover:cursor-pointer"
			onClick={onClick}
		>
			{children}
		</div>
	);
}

const AddText = (props: Props) => {
  const addText = useCanvasEditorStore((state) => state.addText);


	const addTextToCanvas = (text: string, style: DTextProps) => {
		addText(text, style);
	};

	return (
		<div className={props.className}>
			<Popover>
				<PopoverTrigger asChild>{props.children}</PopoverTrigger>
				<PopoverContent className="w-96">
					<div className="flex flex-col gap-2">
						<X_Wrapper
							onClick={() =>
								addTextToCanvas("Add Title", {
									
								})
							}
						>
							<p style={{
								fontSize: "36px",
								fontWeight: "700",
							}}>Add Title</p>
						</X_Wrapper>
						<X_Wrapper
							onClick={() =>
								addTextToCanvas("Add Title 2", canvasTitle2Style)
							}
						>
							<p style={canvasTitle2Style}>Add Title 2</p>
						</X_Wrapper>
						<X_Wrapper
							onClick={() =>
								addTextToCanvas("Add Subtitle", canvasSubtitleStyle)
							}
						>
							<p style={canvasSubtitleStyle}>Add Subtitle</p>
						</X_Wrapper>
						<X_Wrapper
							onClick={() => addTextToCanvas("Add Text", canvasBodyStyle)}
						>
							<p style={canvasBodyStyle}>Add Text</p>
						</X_Wrapper>
						<X_Wrapper
							onClick={() =>
								addTextToCanvas("Add Caption", canvasCaptionStyle)
							}
						>
							<p style={canvasCaptionStyle}>Add Caption</p>
						</X_Wrapper>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default AddText;


