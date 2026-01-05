import React from 'react';
import './PoppyRemembrance.css';

const PoppyRemembrance = () => {
    return (
        <div className="poppy-page">
            <section className="poppy-hero">
                <h1>Poppy & Remembrance</h1>
            </section>

            <div className="poppy-content">
                <p className="poppy-intro">
                    The Poppy is the symbol of Remembrance. Every year, from the last Friday of October to Remembrance Day,
                    Canadians donate to the campaign and wear the Poppy as a pledge to honour Canada's Veterans
                    and remember those who sacrificed for our freedoms.
                </p>

                <section className="poppy-section">
                    <h2>History of the Poppy</h2>
                    <p>
                        Why was the poppy chosen as the symbol of remembrance for Canada’s war dead? The poppy,
                        an international symbol for those who died in war, also had international origins.
                        A writer first made the connection between the poppy and battlefield deaths during the
                        Napoleonic wars of the early 19th century.
                    </p>
                    <p>
                        During the First World War, heavy bombardments churned the soil in Flanders, enrichment it with lime
                        from the rubble and allowing the 'popaver rhoeas' to thrive. When the war ended, the poppies began
                        to disappear.
                    </p>

                    <div className="mccrae-box">
                        <h4>Lieutenant-Colonel John McCrae</h4>
                        <p>
                            The person responsible more than any other for the adoption of the Poppy as a symbol of
                            Remembrance in Canada was Lieutenant-Colonel John McCrae, a Canadian Medical Officer.
                            In May 1915, following the death of a fellow soldier, he scrawled 15 famous lines:
                        </p>
                        <blockquote style={{ fontStyle: 'italic' }}>
                            "In Flanders fields the poppies blow..."
                        </blockquote>
                    </div>

                    <h3>The Flower of Remembrance</h3>
                    <p>
                        Following the example of Moina Michael in America and Madame Guerin in France,
                        the Great War Veterans’ Association in Canada (the predecessor of The Royal Canadian Legion)
                        officially adopted the Poppy as its Flower of Remembrance on 5 July 1921.
                    </p>
                    <p>
                        Thanks to the millions of Canadians who wear the flowers each November, the little red plant
                        has never died. And neither have Canadian’s memories for 117,000 of their countrymen
                        who died in battle.
                    </p>
                </section>

                <section className="poppy-section">
                    <h2>A Symbol of Unity</h2>
                    <p>
                        Today, when people from all parts of Canada and from all walks of life join together
                        in their pledge to never forget, they choose to display this collective reminiscence
                        by wearing a Poppy. They stand united as Canadians sharing a common history of sacrifice
                        and commitment.
                    </p>

                    <h3>The Lapel Poppy</h3>
                    <p>
                        The lapel Poppies that are worn in Canada today were first made in 1922 by disabled veterans.
                        Until 1996, they were produced at "Vetcraft" workshops. Today, the Legion continues to ensure
                        that all operations are conducted under strict control and oversight, maintaining the
                        sanctity of the tradition.
                    </p>
                </section>

                <section className="ceremony-card">
                    <h2>Remembrance Day Ceremony</h2>
                    <p>Join us at Branch 560 to pay our respects and remember the fallen.</p>
                    <div className="ceremony-details">
                        <p><strong>Date:</strong> November 11th</p>
                        <p><strong>Time:</strong> 10:45 AM</p>
                        <p><strong>Location:</strong> Branch Cenotaph</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PoppyRemembrance;
