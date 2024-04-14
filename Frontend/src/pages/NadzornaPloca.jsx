import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Highcharts from 'highcharts';
import PieChart from 'highcharts-react-official';
import Service from '../services/GrupaService';
import useLoading from '../hooks/useLoading';
import useError from '../hooks/useError';

export default function NadzornaPloca() {
  const [podaci, setPodaci] = useState([]);
  const { showLoading, hideLoading } = useLoading();
  const { prikaziError } = useError();


  async function getPodaci() {
    showLoading();
    const odgovor = await Service.get('Grupa');
    if(!odgovor.ok){
      hideLoading();
      prikaziError(odgovor.podaci);
        return;
    }

    setPodaci(odgovor.podaci.map((grupa) => {
      return {
        y: grupa.brojkandidata,
        name: grupa.naziv,
      };
    }));
    hideLoading();
  }

  useEffect(() => {
    getPodaci();
  }, []);

  return (
    <Container className='mt-4'>
      {podaci.length > 0 && (
        <PieChart
          highcharts={Highcharts}
          options={{
            ...fixedOptions,
            series: [
              {
                name: 'Kandidati',
                colorByPoint: true,
                data: podaci,
              },
            ],
          }}
        />
      )}
    </Container>
  );
}

const fixedOptions = {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
  },
  title: {
    text: 'Broj kandidata po grupi',
    align: 'left',
  },
  tooltip: {
    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
  },
  accessibility: {
    enabled: false,
    point: {
      valueSuffix: '%',
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
      },
    },
  },
};
