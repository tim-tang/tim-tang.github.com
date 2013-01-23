#!/bin/sh
#Target: calculate personal salary detail information.

TAX_THRESHOLD=3500
SHOPPING_CARD=400

echo "SELECT YOUR SALARY:"
echo "-------------------------------------------------------------"
select salary_option in "8000.00" "8500.00" "9000.00" "9500.00" "10000.00" "10500.00" "11000.00" "11500.00" "12000.00" "Exit Program"

do
    case $salary_option in
        "8000.00")
            SALARY=8000.00
            break
            ;;
        "8500.00")
            SALARY=8500.00
            break
            ;;
        "9000.00")
            SALARY=9000.00
            break
            ;;
        "9500.00")
            SALARY=9500.00
            break
            ;;
        "10000.00")
            SALARY=10000.00
            break
            ;;
        "10500.00")
            SALARY=10500.00
            break
            ;;
        "11000.00")
            SALARY=11000.00
            break
            ;;
        "11500.00")
            SALARY=11500.00
            break
            ;;
        "12000.00")
            SALARY=12000.00
            break
            ;;
        "Exit Program")
            echo "Thanks for using, bye bye!"
            exit 0
    esac
done

SPF_PERSONAL=`echo "scale=2;$SALARY*0.19"|bc`
SPF_COMPANY=`echo "scale=2;$SALARY*0.28"|bc`

echo "SELECT YOUR TAX RATE:"
echo "-------------------------------------------------------------"
select tax_option in "0.1" "0.2" "0.25" "Exit Program"

do
    case $tax_option in
        "0.1")
            TAX_RATE=0.1
            TAX_DEDUCT=105
            break
            ;;
        "0.2")
            TAX_RATE=0.2
            TAX_DEDUCT=555
            break
            ;;
        "0.25")
            TAX_RATE=0.25
            TAX_DEDUCT=1005
            break
            ;;
        "Exit Program")
            echo "Thanks for using, bye bye!"
            exit 0
    esac
done

print_table()
{
    echo
    echo "-------------------------------------------------------------"
    echo "SALARY => $SALARY ¥"
    echo "-------------------------------------------------------------"
    echo "SPF_PERSONAL => $SPF_PERSONAL ¥"
    echo "-------------------------------------------------------------"
    echo "SPF_COMPANY => $SPF_COMPANY ¥"
    echo "-------------------------------------------------------------"
    echo "TAX => $TAX ¥"
    echo "-------------------------------------------------------------"
    echo "ACTUAL_SALARY => $ACTUAL_SALARY ¥"
    echo "-------------------------------------------------------------"
    echo "TOTAL_SALARY=> $TOTAL_SALARY ¥"
    echo "-------------------------------------------------------------"
    echo
}

normal_formula()
{
    SALARY_UNTAX=`echo "scale=2;$SALARY-$SPF_PERSONAL"|bc`
    SALARY_TAX_PART=`echo "scale=2;$SALARY_UNTAX-$TAX_THRESHOLD"|bc`
    TAX=`echo "scale=2;($SALARY_TAX_PART*$TAX_RATE)-$TAX_DEDUCT"|bc`
    ACTUAL_SALARY=`echo "scale=2;$SALARY_UNTAX-$TAX"|bc`
    TOTAL_SALARY=`echo "scale=2;$ACTUAL_SALARY+$SPF_PERSONAL+$SPF_COMPANY"|bc`
    print_table
}

normal_card_formula()
{
    SALARY_UNTAX=`echo "scale=2;$SALARY+$SHOPPING_CARD-$SPF_PERSONAL"|bc`
    SALARY_TAX_PART=`echo "scale=2;$SALARY_UNTAX-$TAX_THRESHOLD"|bc`
    TAX=`echo "scale=2;($SALARY_TAX_PART*$TAX_RATE)-$TAX_DEDUCT"|bc`
    ACTUAL_SALARY=`echo "scale=2;$SALARY_UNTAX-$TAX"|bc`
    TOTAL_SALARY=`echo "scale=2;$ACTUAL_SALARY+$SPF_PERSONAL+$SPF_COMPANY"|bc`
    print_table
}

special_formula()
{
    SALARY_UNTAX=`echo "scale=2;$SALARY+$SPF_COMPANY+$SHOPPING_CARD"|bc`
    SALARY_TAX_PART=`echo "scale=2;$SALARY_UNTAX-$SPF_PERSONAL-$TAX_THRESHOLD"|bc`
    TAX=`echo "scale=2;($SALARY_TAX_PART*$TAX_RATE)-$TAX_DEDUCT"|bc`
    ACTUAL_SALARY=`echo "scale=2;$SALARY_UNTAX-$TAX"|bc`
    TOTAL_SALARY=$SALARY_UNTAX
    print_table
}

echo "SELECT YOUR SALARY TYPE:"
echo "-------------------------------------------------------------"
select salary_option in "Normal Formula" "Normal Formula Card" "Special Formula" "Exit Program"

do
    case $salary_option in
        "Normal Formula")
            normal_formula ;;
        "Normal Formula Card")
            normal_card_formula ;;
        "Special Formula")
            special_formula ;;
        "Exit Program")
            echo "Thanks for using, bye bye!"
            exit 0
    esac
done
