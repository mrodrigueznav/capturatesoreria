export default defineEventHandler(() => {
  return [
    {
      id: 1,
      aFavor: "emp1",
      sucursal: "cdmx",
      centroCostos: "cc1",
      concepto: "con1",
      tipo: "ingreso",
      importe: 15000.00,
      banco: "bbva",
      deLaCuenta: "acc1",
      cuenta: "12345678",
      razonSocial: "comp1",
      observaciones: "Pago de nómina quincenal",
      fechaCreacion: "2024-04-01T10:30:00Z"
    },
    {
      id: 2,
      aFavor: "prov1",
      sucursal: "gdl",
      centroCostos: "cc2",
      concepto: "con2",
      tipo: "egreso",
      importe: 25750.50,
      banco: "santander",
      deLaCuenta: "acc2",
      cuenta: "87654321",
      razonSocial: "comp2",
      observaciones: "Pago de servicios mensuales",
      fechaCreacion: "2024-04-02T15:45:00Z"
    },
    {
      id: 3,
      aFavor: "emp2",
      sucursal: "mty",
      centroCostos: "cc3",
      concepto: "con3",
      tipo: "transferencia",
      importe: 8900.00,
      banco: "banamex",
      deLaCuenta: "acc3",
      cuenta: "98765432",
      razonSocial: "comp3",
      observaciones: "Reembolso de gastos",
      fechaCreacion: "2024-04-03T09:15:00Z"
    }
  ]
})