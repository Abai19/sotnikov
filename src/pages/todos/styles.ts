import { styled } from "styled-components";

export const TodosWrapper = styled.div`
    width: 40%;
    margin: 0 auto;
    @media screen and (max-width: 1200px) {
        width: 60%;
    }
    @media screen and (max-width: 922px) {
        width: 70%;
    }
    @media screen and (max-width: 768px) {
        width: 80%;
    }
    
    @media screen and (max-width: 480px) {
        width: 95%;
    }
`
export const FiltersWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding-top: 1rem;
    padding-bottom: 1rem;
    flex-wrap: wrap;
    align-items: center;
`

export const FilterButtons = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`
export const FiltersSelects = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`
export const ActionsBlock = styled.div`
    display: flex;
    gap: 5px;
`
export const TodoBlock = styled.div`
    display: flex;
    gap: 10px;

`