package com.beifen.edu.administration.constant;

//二学院编码
public enum  SecondaryCollegeConstant {

    MECHANICAL_ENGINEERING ("01","机械工程学院"),
    AUTOMOTIVE_ENGINEERING ("02","汽车工程学院"),
    INFORMATION_TECHNOLOGY ("03","信息科技学院"),
    FINANCE_ECONOMICS ("04","财经学院"),
    BUSINESS ("05","商贸学院"),
    AGRONOMY  ("06","农艺学院"),
    HORTICULTURE  ("07","园艺学院"),
    ANIMAL_SCIENCE ("08","动物科技学院"),
    GOLF  ("09","高尔夫学院"),
    IDEOLOGICAL_POLITICAL ("10","思想政治理论教学部"),
    BASIC_PHYSICAL ("11","基础与体育教学部"),
    ENROLLMENT_EMPLOYMENT ("12","招生就业处（创新创业学院）"),
    EDUCATIONAL_ADMINISTRATION ("99","教务处"),
    COLLEGE_EXPANSION ("98","扩招学院");



    private SecondaryCollegeConstant(String value,String name){
        this.value=value;
        this.name=name;
    }
    private final String value;
    private final String name;

    public String getValue() {
        return value;
    }

    public String getName() {
        return name;
    }
}
