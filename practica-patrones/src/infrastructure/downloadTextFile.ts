import type { ITextFilePayload } from '../domain/interfaces/ITextFilePayload';

export const downloadTextFile = ({ filename, content }: ITextFilePayload): void => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = objectUrl;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(objectUrl);
};
