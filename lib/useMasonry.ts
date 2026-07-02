import { useMemo } from "react";

import type { ImageItem } from "@/components/ui/image-gallery";

export interface MasonryItem extends ImageItem {
    x: number;
    y: number;
    displayHeight: number;
    displayWidth: number;
}

export interface MasonryConfig {
    gap: number;
    columns: number;
}

const useMasonry = (
    images: ImageItem[],
    containerWidth: number,
    config: MasonryConfig,
) => {
    return useMemo(() => {
        if (!containerWidth || images.length === 0 || config.columns < 1) {
            return {
                layout: [] as MasonryItem[],
                totalHeight: 0,
            };
        }

        const totalGapWidth = config.gap * (config.columns - 1);
        const availableWidth = containerWidth - totalGapWidth;
        const columnWidth = availableWidth / config.columns;
        const columnHeights: number[] = Array(config.columns).fill(0);
        const columnImages: ImageItem[][] = Array.from(
            { length: config.columns },
            () => [],
        );

        images.forEach((image) => {
            const columnIndex = columnHeights.indexOf(Math.min(...columnHeights));
            const aspectRatio = image.width && image.height ? image.width / image.height : 1;
            const displayHeight = columnWidth / aspectRatio;

            columnHeights[columnIndex] += displayHeight + config.gap;
            columnImages[columnIndex]?.push(image);
        });

        const layout: MasonryItem[] = [];
        const totalHeight = Math.max(...columnHeights) - config.gap;

        columnImages.forEach((column, colIndex) => {
            if (column.length === 0) {
                return;
            }

            const totalImageHeight = column.reduce((sum, image) => {
                const aspectRatio = image.width && image.height ? image.width / image.height : 1;
                return sum + columnWidth / aspectRatio;
            }, 0);
            const totalGaps = config.gap * (column.length - 1);
            const scaleFactor = (totalHeight - totalGaps) / totalImageHeight;
            let columnY = 0;

            column.forEach((image) => {
                const aspectRatio = image.width && image.height ? image.width / image.height : 1;
                const displayHeight = (columnWidth / aspectRatio) * scaleFactor;

                layout.push({
                    ...image,
                    x: colIndex * (columnWidth + config.gap),
                    y: columnY,
                    displayWidth: columnWidth,
                    displayHeight,
                });

                columnY += displayHeight + config.gap;
            });
        });

        return {
            layout,
            totalHeight,
        };
    }, [images, containerWidth, config.gap, config.columns]);
};

export { useMasonry };
