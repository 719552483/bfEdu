package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu206;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


@Configuration
public interface Edu206Dao extends JpaRepository<Edu206, Long>, JpaSpecificationExecutor<Edu206> {

    //根据权限和发布标志获教学任务书ID
    @Query(value = "select a.* from edu206 a,edu108 b,edu107 c " +
            "where a.EDU108_ID = b.EDU108_ID " +
            "and b.EDU107_ID = c.EDU107_ID " +
            "and c.EDU104 in ?1 ", nativeQuery = true)
    List<Edu206> findTaskIdByDepartments(List<String> departments);

}
