import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import categories from '../../json/category.json';
import transactionsAPI from '../../services/transactions-api';
import Media from 'react-media';
import FormDatePicker from '../DatePicker/DatePicker';
import s from './TransactionForm.module.css';
import sprite from '../../svg/sprite.svg';
import Table from '../Table/Table';
import Summary from '../Summary/Summary';
import { useSelector, useDispatch } from 'react-redux';
import { getAllTransactions } from '../../redux/transactions/selectors';
import {
  getAllUserTransactions,
  addTransactionToStore,
  getAllIncome,
} from '../../redux/transactions/operations';
import getUserBalance from '../../redux/auth/selectors';
import TransactionSwitch from '../TransactionSwitch/TransactionSwitch';

import Button from '../Buttons/Button';
import DatePicker from '../DatePicker/DatePicker';
import { changeIncomeState } from '../../redux/incomeReducer/slice';
import { getIncomeState } from '../../redux/incomeReducer/selectors';

// import "./styles.css";

export default function TransactionsForm() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllUserTransactions());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ defaultValues: { subcategory: '', category: '' } });

  const currState = useSelector(getIncomeState);

  let transactions = useSelector(getAllTransactions);
  // console.log('transactions', transactions);
  let sixMonthsReport = null;

  const onSubmit = async ({ category, subcategory, sum }, e) => {
    // console.log('data', data)
    // console.log('e', e)
    const transactionToAdd = {
      category,
      subcategory,
      sum,
    };

    const status = dispatch(addTransactionToStore(transactionToAdd));
    console.log('status', status);

    const allIncomeTrans = dispatch(getAllIncome('income'));
    console.log('allIncomeTrans', allIncomeTrans);

    transactions = allIncomeTrans.data;
  };

  //to reset values after successful submit
  useEffect(() => {
    if (isSubmitSuccessful) {
      console.log('inside isSubmitSuccessful');
      reset({ subcategory: '', category: '', sum: 0 });
    }
  }, [isSubmitSuccessful, reset]);

  console.log(errors);

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.category,
  }));
  // console.log('categoryOptions', categoryOptions)
  const onHandleChangeState = () => {
    dispatch(changeIncomeState(true));
  };

  return (
    <>
      <TransactionSwitch />
      <form className={s.submit_form} onSubmit={handleSubmit(onSubmit)}>
        {/* <label>First name</label>
            <input type="text" {...register("firstName", { required: true })} />
            {errors.firstName && <p>This is required</p>} */}

        {/* <label>Last name</label>
            <input type="text" {...register("lastName")} /> */}
        <div className={s.inputs_div}>
          <Media queries={{ small: { maxWidth: 767 } }}>
            {matches => (matches.small ? <></> : <DatePicker />)}
          </Media>

          <input
            className={s.input}
            type="text"
            placeholder=""
            {...register('subcategory', { required: true })}
          />
          <select
            className={s.control}
            {...register('category', { required: true })}
          >
            {categoryOptions.map(option => (
              <option value={option.label} id={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <div className={s.currency_div}>
            <input
              type="number"
              data-type="currency"
              placeholder="00.00UAH"
              step="0.01"
              min="0,00000001"
              className={s.input_price}
              {...register('sum', { required: true })}
            />
            <div className={s.culc_div}>
              <svg
                className={s.calculator}
                fill=" #52555F"
                width="20"
                height="20"
              >
                <use href={`${sprite}#calculator`}></use>
              </svg>
            </div>
          </div>
        </div>

        <div className={s.button_div}>
          <Button type="submit" name="Ввод" value="Ввод" isPrimary></Button>
          <Button
            type="reset"
            name="Очистить"
            value="Очистить"
            className={s.button_text}
            onClick={onHandleChangeState}
          ></Button>
        </div>

        {/* <input type="submit" value="Ввод" className={s.submit_button} />
        <input
          // style={{ display: 'block', marginTop: 20 }}
          type="reset"
          value="Очистить"
          className={s.submit_button}
        /> */}
      </form>
      <div className={s.summary_position}>
        <Table />
        <Media queries={{ small: { maxWidth: 767 } }}>
          {matches => (matches.small ? <></> : <Summary />)}
        </Media>
      </div>
    </>
  );
}
