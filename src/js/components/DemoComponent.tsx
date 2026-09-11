import { useTranslationFn } from '@/hooks';
import { type ReactNode, useEffect, useState } from 'react';

interface DemoComponentProps {
    title: String,
    subtitle: String,
    itemsListURL: URL
};

interface DemoItemData {
    id: string,
    message: string
};

const DemoComponent = ({title, subtitle, itemsListURL}: DemoComponentProps)  => {

    const t = useTranslationFn();

    let upperCaseTitle = title.toUpperCase();

    const [itemsData, setItemsData] = useState([]);

    useEffect(() => {
        fetch(itemsListURL)
            .then(response => response.json())
            .then(json => json.demo)
            .then(data => setItemsData(data))
    }, []);

    const listItems = itemsData.map(item => <li>{item.message}</li>);

    return (
        <>
            <h1>{upperCaseTitle}</h1>
            <h2>{subtitle}</h2>

            <ul>
                {listItems}
            </ul>
        </>
    );
}
