package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu006;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


@Configuration
public interface Edu006Dao extends JpaRepository<Edu006, Long>, JpaSpecificationExecutor<Edu006> {

    //查询违纪学生ID
    @Query(value = "select distinct to_char(e.Edu001_ID) from Edu007 e",nativeQuery = true)
    List<String> findStudentIdList();

    //根据edu600ID集合查询违纪记录
    @Query(value = "select new com.beifen.edu.administration.domian.Edu006(e.edu006_ID,e.edu101_ID,e.edu001_ID,e.studentName," +
            "e.creatUser,e.breachType,e.breachName,e.breachDate,e.handlingOpinions,e.creatDate,f.cancelState,f.cancelDate,e.approvalState) " +
            "from Edu006 e, Edu007 f where e.edu006_ID = f.edu006_ID and e.edu006_ID in ?1")
    List<Edu006> findAllByEdu006Ids(List<Long> edu006IdList);

}
