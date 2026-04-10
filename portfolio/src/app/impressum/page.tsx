import React from "react";

export default function Impressum() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 max-w-3xl mx-auto dark:text-gray-200">
      <h1 className="text-4xl font-bold mb-10">Impressum</h1>
      
      <div className="space-y-8 text-lg">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Information according to § 5 TMG</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Brian Maina<br />
            Kwa Nyaga, Gikambura<br />
            P.O. Box 24881, Karen<br />
            Kenya
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">Contact</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Phone: +254 728 036 420<br />
            Email: brian@brianmaina.de
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">Dispute Resolution</h2>
          <p className="text-gray-700 dark:text-gray-300">
            The European Commission provides a platform for online dispute resolution (OS): 
            <a href="https://ec.europa.eu/consumers/odr." target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline">
              https://ec.europa.eu/consumers/odr.
            </a><br />
            I am not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
          </p>
        </section>
      </div>
    </main>
  );
}